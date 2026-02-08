import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DataSourceEntity } from '../database/entities/data-source.entity';
import { SourceDataEntity } from '../database/entities/source-data.entity';
import { SchemasService } from '../schemas/schemas.service';
import { ConnectorFactory, ConnectorType } from '../connectors';

@Injectable()
export class SourcesService {
  private readonly logger = new Logger(SourcesService.name);

  constructor(
    @Inject('SOURCE_REPOSITORY')
    private sourcesRepository: Repository<DataSourceEntity>,
    @Inject('SOURCE_DATA_REPOSITORY')
    private sourceDataRepository: Repository<SourceDataEntity>,
    private schemasService: SchemasService,
  ) {}

  async findAll(): Promise<DataSourceEntity[]> {
    return await this.sourcesRepository.find();
  }

  async findOne(id: string): Promise<DataSourceEntity | undefined> {
    return await this.sourcesRepository.findOneBy({ id });
  }

  async get(id: string): Promise<DataSourceEntity> {
    const source = await this.sourcesRepository.findOneBy({ id });
    if (!source) throw new NotFoundException();
    return source;
  }

  async create(source: DataSourceEntity): Promise<DataSourceEntity> {
    return await this.sourcesRepository.save(source);
  }

  async update(source: DataSourceEntity): Promise<DataSourceEntity> {
    return await this.sourcesRepository.save(source);
  }

  async remove(id: string): Promise<DeleteResult> {
    const source = await this.sourcesRepository.findOneBy({ id });
    if (!source) throw new NotFoundException();
    return await this.sourcesRepository.delete(id);
  }

  async testConnection(id: string): Promise<DataSourceEntity> {
    const source = await this.get(id);
    source.status = 'testing';
    await this.sourcesRepository.save(source);

    // Run actual connection test asynchronously
    this.runConnectionTest(source).catch((err) => {
      this.logger.error(`Connection test failed for source ${id}: ${err.message}`);
    });

    return source;
  }

  private async runConnectionTest(source: DataSourceEntity): Promise<void> {
    try {
      if (!ConnectorFactory.isSupported(source.type)) {
        throw new Error(`Unsupported connector type: ${source.type}`);
      }

      const connector = ConnectorFactory.getConnector(source.type as ConnectorType);
      const config = { ...source.connectionConfig, sourceId: source.id };
      const result = await connector.testConnection(config);

      source.status = result.success ? 'connected' : 'error';

      if (!result.success) {
        source.errorLog = [
          ...source.errorLog,
          `Connection test failed at ${new Date().toISOString()}: ${result.error}`,
        ];
      } else {
        source.errorLog = [];
        // Store connection metadata
        if (result.metadata) {
          source.connectionConfig = {
            ...source.connectionConfig,
            _lastTestMetadata: JSON.stringify(result.metadata),
          };
        }
      }

      await this.sourcesRepository.save(source);

      // Discover schema on successful connection
      if (result.success) {
        await this.schemasService.discoverSchema(source.id);
      }
    } catch (error: any) {
      source.status = 'error';
      source.errorLog = [
        ...source.errorLog,
        `Connection test error at ${new Date().toISOString()}: ${error.message}`,
      ];
      await this.sourcesRepository.save(source);
    }
  }

  async sync(id: string): Promise<DataSourceEntity> {
    const source = await this.get(id);
    source.status = 'syncing';
    await this.sourcesRepository.save(source);

    // Run sync operation asynchronously
    this.runSync(source).catch((err) => {
      this.logger.error(`Sync failed for source ${id}: ${err.message}`);
    });

    return source;
  }

  private async runSync(source: DataSourceEntity): Promise<void> {
    try {
      if (!ConnectorFactory.isSupported(source.type)) {
        throw new Error(`Unsupported connector type: ${source.type}`);
      }

      const connector = ConnectorFactory.getConnector(source.type as ConnectorType);
      const config = { ...source.connectionConfig, sourceId: source.id };

      // Fetch data from source
      const data = await connector.fetchData(config, { limit: 10000 });

      // Store the fetched data
      const batchId = uuidv4();
      await this.storeSourceData(source.id, data, batchId);

      // Discover/update schema from the fetched data
      await this.schemasService.discoverSchema(source.id);

      // Update sync metadata
      source.status = 'connected';
      source.lastSyncAt = new Date().toISOString();
      source.connectionConfig = {
        ...source.connectionConfig,
        recordsIngested: String(data.length),
        _lastSyncRecordCount: String(data.length),
        _lastBatchId: batchId,
      };

      await this.sourcesRepository.save(source);

      this.logger.log(`Sync completed for source ${source.id}: ${data.length} records stored`);
    } catch (error: any) {
      source.status = 'error';
      source.errorLog = [
        ...source.errorLog,
        `Sync failed at ${new Date().toISOString()}: ${error.message}`,
      ];
      await this.sourcesRepository.save(source);
    }
  }

  /**
   * Store fetched data in the source_data table
   */
  private async storeSourceData(sourceId: string, data: any[], batchId: string): Promise<void> {
    // Clear previous data for this source (replace strategy)
    await this.sourceDataRepository.delete({ sourceId });

    // Insert new data in batches
    const batchSize = 100;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const entities = batch.map((row) => ({
        sourceId,
        batchId,
        data: JSON.stringify(row),
      }));
      await this.sourceDataRepository.insert(entities);
    }
  }

  /**
   * Get stored data for a source
   */
  async getSourceData(
    sourceId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<{ rows: any[]; total: number }> {
    const [entities, total] = await this.sourceDataRepository.findAndCount({
      where: { sourceId },
      take: options?.limit || 1000,
      skip: options?.offset || 0,
      order: { ingestedAt: 'DESC' },
    });

    const rows = entities.map((e) => JSON.parse(e.data));
    return { rows, total };
  }

  /**
   * Clear stored data for a source
   */
  async clearSourceData(sourceId: string): Promise<void> {
    await this.sourceDataRepository.delete({ sourceId });
  }

  /**
   * Fetch data from a source using its connector
   */
  async fetchData(id: string, options?: { limit?: number; offset?: number }): Promise<any[]> {
    const source = await this.get(id);

    if (!ConnectorFactory.isSupported(source.type)) {
      throw new Error(`Unsupported connector type: ${source.type}`);
    }

    const connector = ConnectorFactory.getConnector(source.type as ConnectorType);
    const config = { ...source.connectionConfig, sourceId: source.id };

    return connector.fetchData(config, options);
  }
}
