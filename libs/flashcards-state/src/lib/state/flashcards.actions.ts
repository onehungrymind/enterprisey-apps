import { createAction, props } from '@ngrx/store';
import { FlashcardsEntity } from './flashcards.models';

export const initFlashcards = createAction('[Flashcards Page] Init');

export const loadFlashcardsSuccess = createAction(
  '[Flashcards/API] Load Flashcards Success',
  props<{ flashcards: FlashcardsEntity[] }>()
);

export const loadFlashcardsFailure = createAction(
  '[Flashcards/API] Load Flashcards Failure',
  props<{ error: any }>()
);
