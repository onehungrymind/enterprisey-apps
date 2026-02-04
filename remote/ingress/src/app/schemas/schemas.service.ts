import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataSchemaEntity } from '../database/entities/data-schema.entity';

@Injectable()
export class SchemasService {
  constructor(
    @Inject('SCHEMA_REPOSITORY')
    private schemasRepository: Repository<DataSchemaEntity>,
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
    const existing = await this.schemasRepository.findOneBy({ sourceId });

    const schema = existing || new DataSchemaEntity();
    schema.sourceId = sourceId;
    schema.discoveredAt = new Date().toISOString();
    schema.version = existing ? existing.version + 1 : 1;
    schema.fields = [
      { name: 'id', type: 'number', nullable: false, sampleValues: ['1', '2', '3'] },
      { name: 'name', type: 'string', nullable: false, sampleValues: ['Alice', 'Bob', 'Charlie'] },
      { name: 'email', type: 'string', nullable: true, sampleValues: ['alice@example.com'] },
      { name: 'created_at', type: 'date', nullable: false, sampleValues: ['2025-01-01T00:00:00Z'] },
      { name: 'active', type: 'boolean', nullable: false, sampleValues: ['true', 'false'] },
    ];

    return await this.schemasRepository.save(schema);
  }
}
