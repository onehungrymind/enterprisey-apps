import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as FlashcardsActions from './flashcards.actions';
import { FlashcardsEntity } from './flashcards.models';

export const FLASHCARDS_FEATURE_KEY = 'flashcards';

export interface FlashcardsState extends EntityState<FlashcardsEntity> {
  selectedId?: string | number; // which Flashcards record has been selected
  loaded: boolean; // has the Flashcards list been loaded
  error?: string | null; // last known error (if any)
}

export interface FlashcardsPartialState {
  readonly [FLASHCARDS_FEATURE_KEY]: FlashcardsState;
}

export const flashcardsAdapter: EntityAdapter<FlashcardsEntity> =
  createEntityAdapter<FlashcardsEntity>();

export const initialFlashcardsState: FlashcardsState =
  flashcardsAdapter.getInitialState({
    // set initial required properties
    loaded: false,
  });

const reducer = createReducer(
  initialFlashcardsState,
  on(FlashcardsActions.initFlashcards, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(FlashcardsActions.loadFlashcardsSuccess, (state, { flashcards }) =>
    flashcardsAdapter.setAll(flashcards, { ...state, loaded: true })
  ),
  on(FlashcardsActions.loadFlashcardsFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function flashcardsReducer(
  state: FlashcardsState | undefined,
  action: Action
) {
  return reducer(state, action);
}
