import { Challenge } from '../database/entities/challenge.entity';
import { Connection } from 'typeorm';

export const challengeProviders = [
  {
    provide: 'CHALLENGE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Challenge),
    inject: ['DATABASE_CONNECTION'],
  },
];
