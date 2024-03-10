import { createSelector } from '@ngrx/store';
import { getNotesState } from './state';
import { NotesState, notesAdapter } from './notes.reducer';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = notesAdapter.getSelectors();

const getNotesSlice = createSelector(getNotesState, (state) => state.notes);

export const getNoteIds = createSelector(getNotesSlice, selectIds);
export const getNotesEntities = createSelector(getNotesSlice, selectEntities);
export const getAllNotes = createSelector(getNotesSlice, selectAll);
export const getNotesTotal = createSelector(getNotesSlice, selectTotal);
export const getSelectedNoteId = createSelector(getNotesSlice, (state: NotesState) => state.selectedId);

export const getNotesLoaded = createSelector(
  getNotesSlice,
  (state: NotesState) => state.loaded
);

export const getNotesError = createSelector(
  getNotesSlice,
  (state: NotesState) => state.error
);

export const getSelectedNote = createSelector(
  getNotesEntities,
  getSelectedNoteId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
