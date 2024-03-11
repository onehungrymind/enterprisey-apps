/* eslint-disable @typescript-eslint/no-empty-function */
import { Flashcard } from '@proto/api-interfaces';
import { of } from 'rxjs';

export const mockFlashcardsFacade = {
  loadFlashcards: () => {},
  selectFlashcard: () => {},
  deleteFlashcard: () => {},
  updateFlashcard: () => {},
  createFlashcard: () => {},
};

export const mockFlashcardsService = {
  all: () => of([]),
  find: () => of({ ...mockFlashcard }),
  create: () => of({ ...mockFlashcard }),
  update: () => of({ ...mockFlashcard }),
  delete: () => of({ ...mockFlashcard }),
};

export const mockFlashcard: Flashcard = {
  id: '0',
  title: 'mock',
  description: 'mock',
  question: 'mock',
  answer: 'mock',
  user_id: 'mock',
};

export const mockEmptyFlashcard: Flashcard = {
  id: null,
  title: 'mockEmpty',
  description: 'mockEmpty',
  question: 'mockEmpty',
  answer: 'mockEmpty',
  user_id: 'mockEmpty',
};
