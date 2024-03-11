import { Note } from '@proto/api-interfaces';
import { NotesService } from '@proto/notes-data';
import { mockNote, mockNotesService } from '@proto/testing';
import { of, throwError } from 'rxjs';

import { NotesActions } from './notes.actions';
import * as NotesEffects from './notes.effects';

describe('NotesEffects', () => {
  const service = mockNotesService as unknown as NotesService;

  describe('loadNotes$', () => {
    it('should return loadNotesSuccess, on success', (done) => {
      const notes: Note[] = [];
      const action$ = of(NotesActions.loadNotes());

      service.all = jest.fn(() => of(notes));

      NotesEffects.loadNotes(action$, service).subscribe((action) => {
        expect(action).toEqual(NotesActions.loadNotesSuccess({ notes }));
        done();
      });
    });

    it('should return loadNotesFailure, on failure', (done) => {
      const error = new Error();
      const action$ = of(NotesActions.loadNotes());

      service.all = jest.fn(() => throwError(() => error));

      NotesEffects.loadNotes(action$, service).subscribe((action) => {
        expect(action).toEqual(NotesActions.loadNotesFailure({ error }));
        done();
      });
    });
  });

  describe('loadNote$', () => {
    it('should return success with note', (done) => {
      const note = { ...mockNote };
      const action$ = of(NotesActions.loadNote({ noteId: note.id as string }));

      service.find = jest.fn(() => of(note));

      NotesEffects.loadNote(action$, service).subscribe((action) => {
        expect(action).toEqual(NotesActions.loadNoteSuccess({ note }));
        done();
      });
    });

    it('should return failure', (done) => {
      const error = new Error();
      const note = { ...mockNote };
      const action$ = of(NotesActions.loadNote({ noteId: note.id as string }));

      service.find = jest.fn(() => throwError(() => error));

      NotesEffects.loadNote(action$, service).subscribe((action) => {
        expect(action).toEqual(NotesActions.loadNoteFailure({ error }));
        done();
      });
    });
  });

  describe('createNote$', () => {
    it('should return success with note', (done) => {
      const note = { ...mockNote };
      const action$ = of(NotesActions.createNote({ note }));

      mockNotesService.create = jest.fn(() => of(note));

      NotesEffects.createNote(action$, service).subscribe((action) => {
        expect(action).toEqual(NotesActions.createNoteSuccess({ note }));
        done();
      });
    });

    it('should return failure', (done) => {
      const error = new Error();
      const note = { ...mockNote };
      const action$ = of(NotesActions.createNote({ note }));

      service.create = jest.fn(() => throwError(() => error));

      NotesEffects.createNote(action$, service).subscribe((action) => {
        expect(action).toEqual(NotesActions.createNoteFailure({ error }));
        done();
      });
    });
  });

  describe('updateNote$', () => {
    it('should return success with note', (done) => {
      const note = { ...mockNote };
      const action$ = of(NotesActions.updateNote({ note }));

      mockNotesService.update = jest.fn(() => of(note));

      NotesEffects.updateNote(action$, service).subscribe((action) => {
        expect(action).toEqual(NotesActions.updateNoteSuccess({ note }));
        done();
      });
    });

    it('should return failure', (done) => {
      const error = new Error();
      const note = { ...mockNote };
      const action$ = of(NotesActions.updateNote({ note }));

      service.update = jest.fn(() => throwError(() => error));

      NotesEffects.updateNote(action$, service).subscribe((action) => {
        expect(action).toEqual(NotesActions.updateNoteFailure({ error }));
        done();
      });
    });
  });

  describe('deleteNote$', () => {
    it('should return success with note', (done) => {
      const note = { ...mockNote };
      const action$ = of(NotesActions.deleteNote({ note }));

      mockNotesService.delete = jest.fn(() => of(note));

      NotesEffects.deleteNote(action$, service).subscribe((action) => {
        expect(action).toEqual(NotesActions.deleteNoteSuccess({ note }));
        done();
      });
    });

    it('should return failure', (done) => {
      const error = new Error();
      const note = { ...mockNote };
      const action$ = of(NotesActions.deleteNote({ note }));

      service.delete = jest.fn(() => throwError(() => error));

      NotesEffects.deleteNote(action$, service).subscribe((action) => {
        expect(action).toEqual(NotesActions.deleteNoteFailure({ error }));
        done();
      });
    });
  });
});
