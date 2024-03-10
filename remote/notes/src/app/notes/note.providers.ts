import { Connection } from 'typeorm';
import { Note } from '../database/entities/note.entity';

export const noteProviders = [
  {
    provide: 'NOTE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Note),
    inject: ['DATABASE_CONNECTION'],
  },
];
