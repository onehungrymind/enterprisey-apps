import { DataSchemaEntity } from '../database/entities/data-schema.entity';
import { DataSource } from 'typeorm';

export const schemaProviders = [
  {
    provide: 'SCHEMA_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(DataSchemaEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
