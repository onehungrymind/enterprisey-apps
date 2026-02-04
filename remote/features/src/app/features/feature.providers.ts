import { Feature } from '../database/entities/feature.entity';
import { DataSource } from 'typeorm';

export const featureProviders = [
  {
    provide: 'FEATURE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Feature),
    inject: ['DATABASE_CONNECTION'],
  },
];
