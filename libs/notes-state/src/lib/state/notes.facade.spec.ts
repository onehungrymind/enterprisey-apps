import { TestBed } from '@angular/core/testing';
import { ActionsSubject } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { mockNote } from '@proto/testing';

import { NotesActions } from './notes.actions';
import { NotesFacade } from './notes.facade';
import { initialNotesState } from './notes.reducer';

describe('NotesFacade', () => {
  let facade: NotesFacade;
  let store: MockStore;

  const mockActionsSubject = new ActionsSubject();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotesFacade,
        provideMockStore({ initialState: initialNotesState }),
        { provide: ActionsSubject, useValue: mockActionsSubject },
      ],
    });

    facade = TestBed.inject(NotesFacade);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('should dispatch', () => {
    it('select on select(note.id)', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.selectNote(mockNote.id as string);

      const action = NotesActions.selectNote({
        selectedId: mockNote.id as string,
      });

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('loadNotes on loadNotes()', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.loadNotes();

      const action = NotesActions.loadNotes();

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('loadNote on loadNote(note.id)', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.loadNote(mockNote.id as string);

      const action = NotesActions.loadNote({ noteId: mockNote.id as string });

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('createNote on createNote(note)', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.createNote(mockNote);

      const action = NotesActions.createNote({ note: mockNote });

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('updateNote on updateNote(note)', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.updateNote(mockNote);

      const action = NotesActions.updateNote({ note: mockNote });

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('delete on delete(model)', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.deleteNote(mockNote);

      const action = NotesActions.deleteNote({ note: mockNote });

      expect(spy).toHaveBeenCalledWith(action);
    });
  });
});
