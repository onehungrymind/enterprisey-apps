import { createSelector } from '@ngrx/store';
import { getFlashcardsState } from './state';
import { FlashcardsState, flashcardsAdapter } from './flashcards.reducer';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = flashcardsAdapter.getSelectors();

const getFlashcardsSlice = createSelector(getFlashcardsState, (state) => state.flashcards);

export const getFlashcardIds = createSelector(getFlashcardsSlice, selectIds);
export const getFlashcardsEntities = createSelector(getFlashcardsSlice, selectEntities);
export const getAllFlashcards = createSelector(getFlashcardsSlice, selectAll);
export const getFlashcardsTotal = createSelector(getFlashcardsSlice, selectTotal);
export const getSelectedFlashcardId = createSelector(getFlashcardsSlice, (state: FlashcardsState) => state.selectedId);

export const getFlashcardsLoaded = createSelector(
  getFlashcardsSlice,
  (state: FlashcardsState) => state.loaded
);

export const getFlashcardsError = createSelector(
  getFlashcardsSlice,
  (state: FlashcardsState) => state.error
);

export const getSelectedFlashcard = createSelector(
  getFlashcardsEntities,
  getSelectedFlashcardId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
