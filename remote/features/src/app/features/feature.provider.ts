import { Feature } from '../database/entities/feature.entity';
import { Connection } from 'typeorm';

export const featureProviders = [
  {
    provide: 'FEATURE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Feature),
    inject: ['DATABASE_CONNECTION'],
  },
];
