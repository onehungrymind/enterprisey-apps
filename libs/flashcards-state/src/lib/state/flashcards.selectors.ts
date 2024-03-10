import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  FLASHCARDS_FEATURE_KEY,
  FlashcardsState,
  flashcardsAdapter,
} from './flashcards.reducer';

// Lookup the 'Flashcards' feature state managed by NgRx
export const selectFlashcardsState = createFeatureSelector<FlashcardsState>(
  FLASHCARDS_FEATURE_KEY
);

const { selectAll, selectEntities } = flashcardsAdapter.getSelectors();

export const selectFlashcardsLoaded = createSelector(
  selectFlashcardsState,
  (state: FlashcardsState) => state.loaded
);

export const selectFlashcardsError = createSelector(
  selectFlashcardsState,
  (state: FlashcardsState) => state.error
);

export const selectAllFlashcards = createSelector(
  selectFlashcardsState,
  (state: FlashcardsState) => selectAll(state)
);

export const selectFlashcardsEntities = createSelector(
  selectFlashcardsState,
  (state: FlashcardsState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectFlashcardsState,
  (state: FlashcardsState) => state.selectedId
);

export const selectEntity = createSelector(
  selectFlashcardsEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
