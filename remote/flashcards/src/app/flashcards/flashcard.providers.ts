import { Connection } from 'typeorm';
import { Flashcard } from '../database/entities/flashcard.entity';

export const flashcardProviders = [
  {
    provide: 'FLASHCARD_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Flashcard),
    inject: ['DATABASE_CONNECTION'],
  },
];
