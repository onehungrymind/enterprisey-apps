import { DataSource } from 'typeorm';
import { Note } from '../database/entities/note.entity';

export const noteProviders = [
  {
    provide: 'NOTE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Note),
    inject: ['DATABASE_CONNECTION'],
  },
];
