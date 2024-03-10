import { Action } from '@ngrx/store';

import * as NotesActions from './notes.actions';
import { NotesEntity } from './notes.models';
import { NotesState, initialNotesState, notesReducer } from './notes.reducer';

describe('Notes Reducer', () => {
  const createNotesEntity = (id: string, name = ''): NotesEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Notes actions', () => {
    it('loadNotesSuccess should return the list of known Notes', () => {
      const notes = [
        createNotesEntity('PRODUCT-AAA'),
        createNotesEntity('PRODUCT-zzz'),
      ];
      const action = NotesActions.loadNotesSuccess({ notes });

      const result: NotesState = notesReducer(initialNotesState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = notesReducer(initialNotesState, action);

      expect(result).toBe(initialNotesState);
    });
  });
});
