import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataSchemaEntity } from '../database/entities/data-schema.entity';
import { DataSourceEntity } from '../database/entities/data-source.entity';
import { ConnectorFactory, ConnectorType, SchemaField } from '../connectors';

@Injectable()
export class SchemasService {
  private readonly logger = new Logger(SchemasService.name);

  constructor(
    @Inject('SCHEMA_REPOSITORY')
    private schemasRepository: Repository<DataSchemaEntity>,
    @Inject('SOURCE_REPOSITORY')
    private sourcesRepository: Repository<DataSourceEntity>,
  ) {}

  async findAll(): Promise<DataSchemaEntity[]> {
    return await this.schemasRepository.find();
  }

  async findOne(id: string): Promise<DataSchemaEntity> {
    const schema = await this.schemasRepository.findOneBy({ id });
    if (!schema) throw new NotFoundException();
    return schema;
  }

  async findBySourceId(sourceId: string): Promise<DataSchemaEntity | undefined> {
    return await this.schemasRepository.findOneBy({ sourceId });
  }

  async discoverSchema(sourceId: string): Promise<DataSchemaEntity> {
    const source = await this.sourcesRepository.findOneBy({ id: sourceId });
    if (!source) {
      throw new NotFoundException(`Source ${sourceId} not found`);
    }

    const existing = await this.schemasRepository.findOneBy({ sourceId });

    let fields: SchemaField[];
    try {
      if (ConnectorFactory.isSupported(source.type)) {
        const connector = ConnectorFactory.getConnector(source.type as ConnectorType);
        const config = { ...source.connectionConfig, sourceId: source.id };
        fields = await connector.discoverSchema(config);
        this.logger.log(`Discovered ${fields.length} fields for source ${sourceId}`);
      } else {
        // Fallback for unsupported types
        fields = this.getDefaultSchema();
        this.logger.warn(`Using default schema for unsupported source type: ${source.type}`);
      }
    } catch (error: any) {
      this.logger.error(`Schema discovery failed for source ${sourceId}: ${error.message}`);
      // Return existing schema if discovery fails, or use default
      if (existing) {
        return existing;
      }
      fields = this.getDefaultSchema();
    }

    const schema = existing || new DataSchemaEntity();
    schema.sourceId = sourceId;
    schema.discoveredAt = new Date().toISOString();
    schema.version = existing ? existing.version + 1 : 1;
    schema.fields = fields;

    return await this.schemasRepository.save(schema);
  }

  private getDefaultSchema(): SchemaField[] {
    return [
      { name: 'id', type: 'number', nullable: false, sampleValues: ['1', '2', '3'] },
      { name: 'name', type: 'string', nullable: false, sampleValues: ['Sample'] },
      { name: 'created_at', type: 'date', nullable: false, sampleValues: [new Date().toISOString()] },
    ];
  }
}
