import { DataSource } from 'typeorm';
import { Flashcard } from '../database/entities/flashcard.entity';

export const flashcardProviders = [
  {
    provide: 'FLASHCARD_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Flashcard),
    inject: ['DATABASE_CONNECTION'],
  },
];
