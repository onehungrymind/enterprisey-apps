import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { DataSourceEntity } from '../database/entities/data-source.entity';
import { SchemasService } from '../schemas/schemas.service';

@Injectable()
export class SourcesService {
  constructor(
    @Inject('SOURCE_REPOSITORY')
    private sourcesRepository: Repository<DataSourceEntity>,
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

    // Simulate async connection test
    setTimeout(async () => {
      const success = Math.random() > 0.2;
      source.status = success ? 'connected' : 'error';
      if (!success) {
        source.errorLog = [...source.errorLog, `Connection test failed at ${new Date().toISOString()}`];
      } else {
        source.errorLog = [];
      }
      await this.sourcesRepository.save(source);

      // Discover schema on successful connection
      if (success) {
        await this.schemasService.discoverSchema(source.id);
      }
    }, 1500);

    return source;
  }

  async sync(id: string): Promise<DataSourceEntity> {
    const source = await this.get(id);
    source.status = 'syncing';
    await this.sourcesRepository.save(source);

    // Simulate sync operation
    setTimeout(async () => {
      source.status = 'connected';
      source.lastSyncAt = new Date().toISOString();
      await this.sourcesRepository.save(source);
    }, 2000);

    return source;
  }
}
