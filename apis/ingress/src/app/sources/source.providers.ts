import { DataSourceEntity } from '../database/entities/data-source.entity';
import { DataSource } from 'typeorm';

export const sourceProviders = [
  {
    provide: 'SOURCE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(DataSourceEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
