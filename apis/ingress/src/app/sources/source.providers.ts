import { DataSourceEntity } from '../database/entities/data-source.entity';
import { SourceDataEntity } from '../database/entities/source-data.entity';
import { DataSource } from 'typeorm';

export const sourceProviders = [
  {
    provide: 'SOURCE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(DataSourceEntity),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'SOURCE_DATA_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SourceDataEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
