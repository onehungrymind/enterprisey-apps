import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromFlashcards from './flashcards.reducer';

export const FLASHCARDS_FEATURE_KEY = 'flashcards';

export interface State {
  flashcards: fromFlashcards.FlashcardsState;
}

export const reducers: ActionReducerMap<State> = {
  flashcards: fromFlashcards.reducer,
};

export const getFlashcardsState =
  createFeatureSelector<State>(FLASHCARDS_FEATURE_KEY);
