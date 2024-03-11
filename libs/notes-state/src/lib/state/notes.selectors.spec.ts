import { Note } from '@proto/api-interfaces';
import { mockNote } from '@proto/testing';

import { initialNotesState, notesAdapter, NotesState } from './notes.reducer';
import * as NotesSelectors from './notes.selectors';

describe('Notes Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getNotesId = (note: Note) => note['id'];
  const createNote = (id: string, name = '') =>
    ({ ...mockNote, id: id } as Note);

  let state: NotesState;

  beforeEach(() => {
    state = notesAdapter.setAll(
      [
        createNote('PRODUCT-AAA'),
        createNote('PRODUCT-BBB'),
        createNote('PRODUCT-CCC'),
      ],
      {
        ...initialNotesState,
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true,
      }
    );
  });

  describe('Notes Selectors', () => {
    it('getAllNotes() should return the list of Notes', () => {
      const results = NotesSelectors.getAllNotes.projector(state);
      const selId = getNotesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected schema', () => {
      const result = NotesSelectors.getSelectedNote.projector(
        state.entities,
        state.selectedId
      );
      const selId = getNotesId(result as Note);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getNotesLoaded() should return the current 'loaded' status", () => {
      const result = NotesSelectors.getNotesLoaded.projector(state);

      expect(result).toBe(true);
    });

    it("getNotesError() should return the current 'error' state", () => {
      const result = NotesSelectors.getNotesError.projector(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
