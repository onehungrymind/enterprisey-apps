import { Note } from '@proto/api-interfaces';
import { mockEmptyNote, mockNote } from '@proto/testing';
import { NotesActions } from './notes.actions';
import { initialNotesState, NotesState, reducer } from './notes.reducer';
describe('Notes Reducer', () => {
  let notes: Note[];
  beforeEach(() => {
    notes = [
      { ...mockNote, id: '0' },
      { ...mockNote, id: '1' },
      { ...mockNote, id: '2' },
    ];
  });
  describe('valid Notes actions', () => {
    it('loadNotes should set loaded to false', () => {
      const action = NotesActions.loadNotes();
      const expectedState = {
        ...initialNotesState,
        error: null,
      };
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadNotesSuccess should set the list of known Notes', () => {
      const action = NotesActions.loadNotesSuccess({ notes });
      const expectedState = {
        ...initialNotesState,
        loaded: true,
        entities: {
          0: notes[0],
          1: notes[1],
          2: notes[2],
        },
        ids: notes.map((note) => note.id),
      };
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadNotesFailure should set error to error', () => {
      const error = new Error();
      const action = NotesActions.loadNotesFailure({ error });
      const expectedState = {
        ...initialNotesState,
        error,
      };
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadNote should set loaded to false', () => {
      const action = NotesActions.loadNote({ noteId: mockNote.id as string });
      const expectedState = {
        ...initialNotesState,
        loaded: false,
        error: null,
      };
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadNoteSuccess should set loaded to true', () => {
      const action = NotesActions.loadNoteSuccess({ note: mockNote });
      const expectedState = {
        ...initialNotesState,
        loaded: true,
        entities: {
          0: mockNote,
        },
        ids: [mockNote.id],
      };
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadNoteFailure should set error to error', () => {
      const error = new Error();
      const action = NotesActions.loadNoteFailure({ error });
      const expectedState = {
        ...initialNotesState,
        error,
      };
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('updateNoteSuccess should modify note', () => {
      const prepAction = NotesActions.loadNoteSuccess({
        note: { ...mockEmptyNote, id: mockNote.id },
      });
      const prepState: NotesState = reducer(initialNotesState, prepAction);
      const expectedState = {
        ...initialNotesState,
        loaded: true,
        entities: {
          0: mockNote,
        },
        ids: [mockNote.id],
      };
      const action = NotesActions.updateNoteSuccess({ note: mockNote });
      const result: NotesState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('updateNoteFailure should set error to error', () => {
      const error = new Error();
      const action = NotesActions.updateNoteFailure({ error });
      const expectedState = {
        ...initialNotesState,
        error: error,
      };
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('createNoteSuccess should add note', () => {
      const action = NotesActions.createNoteSuccess({ note: mockNote });
      const expectedState = {
        ...initialNotesState,
        loaded: false,
        entities: {
          0: mockNote,
        },
        ids: [mockNote.id],
      };
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('createNoteFailure should set error to error', () => {
      const error = new Error();
      const action = NotesActions.createNoteFailure({ error });
      const expectedState = {
        ...initialNotesState,
        error,
      };
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('deleteNoteSuccess should add note', () => {
      const prepAction = NotesActions.loadNoteSuccess({
        note: mockNote,
      });
      const prepState: NotesState = reducer(initialNotesState, prepAction);
      const expectedState = {
        ...initialNotesState,
        loaded: true,
      };
      const action = NotesActions.deleteNoteSuccess({ note: mockNote });
      const result: NotesState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('deleteNoteFailure should set error to error', () => {
      const error = new Error();
      const action = NotesActions.deleteNoteFailure({ error });
      const expectedState = {
        ...initialNotesState,
        error,
      };
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('selectNote should set selectedId', () => {
      const action = NotesActions.selectNote({
        selectedId: mockNote.id as string,
      });
      const expectedState = {
        ...initialNotesState,
        selectedId: mockNote.id,
      };
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('resetSelectedNote should reset selectedId', () => {
      const prepAction = NotesActions.selectNote({
        selectedId: mockNote.id as string,
      });
      const prepState = reducer(initialNotesState, prepAction);
      const action = NotesActions.resetSelectedNote();
      const expectedState = {
        ...initialNotesState,
        selectedId: null,
      };
      const result: NotesState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('resetNotes should reset notes', () => {
      const prepAction = NotesActions.loadNotesSuccess({ notes });
      const prepState: NotesState = reducer(initialNotesState, prepAction);
      const expectedState = {
        ...initialNotesState,
        loaded: true,
      };
      const action = NotesActions.resetNotes();
      const result: NotesState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
  });
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result: NotesState = reducer(initialNotesState, action);
      expect(result).toBe(initialNotesState);
    });
  });
});
