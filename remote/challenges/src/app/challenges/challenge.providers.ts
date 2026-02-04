import { Challenge } from '../database/entities/challenge.entity';
import { DataSource } from 'typeorm';

export const challengeProviders = [
  {
    provide: 'CHALLENGE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Challenge),
    inject: ['DATABASE_CONNECTION'],
  },
];
