import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NOTES_FEATURE_KEY, NotesState, notesAdapter } from './notes.reducer';

// Lookup the 'Notes' feature state managed by NgRx
export const selectNotesState =
  createFeatureSelector<NotesState>(NOTES_FEATURE_KEY);

const { selectAll, selectEntities } = notesAdapter.getSelectors();

export const selectNotesLoaded = createSelector(
  selectNotesState,
  (state: NotesState) => state.loaded
);

export const selectNotesError = createSelector(
  selectNotesState,
  (state: NotesState) => state.error
);

export const selectAllNotes = createSelector(
  selectNotesState,
  (state: NotesState) => selectAll(state)
);

export const selectNotesEntities = createSelector(
  selectNotesState,
  (state: NotesState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectNotesState,
  (state: NotesState) => state.selectedId
);

export const selectEntity = createSelector(
  selectNotesEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
