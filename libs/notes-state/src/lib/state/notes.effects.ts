import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Note } from '@proto/api-interfaces';
import { NotesService } from '@proto/notes-data';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { NotesActions } from './notes.actions';

export const loadNotes = createEffect(
  (actions$ = inject(Actions), notesService = inject(NotesService)) => {
    return actions$.pipe(
      ofType(NotesActions.loadNotes),
      exhaustMap((action, value) =>
        notesService.all().pipe(
          map((notes: Note[]) => NotesActions.loadNotesSuccess({ notes })),
          catchError((error) => of(NotesActions.loadNotesFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loadNote = createEffect(
  (actions$ = inject(Actions), notesService = inject(NotesService)) => {
    return actions$.pipe(
      ofType(NotesActions.loadNote),
      exhaustMap((action, value) => {
        return notesService.find(action.noteId).pipe(
          map((note: Note) => NotesActions.loadNoteSuccess({ note })),
          catchError((error) => of(NotesActions.loadNoteFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const createNote = createEffect(
  (actions$ = inject(Actions), notesService = inject(NotesService)) => {
    return actions$.pipe(
      ofType(NotesActions.createNote),
      exhaustMap((action, value) => {
        return notesService.create(action.note).pipe(
          map((note: any) => NotesActions.createNoteSuccess({ note })),
          catchError((error) => of(NotesActions.createNoteFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const updateNote = createEffect(
  (actions$ = inject(Actions), notesService = inject(NotesService)) => {
    return actions$.pipe(
      ofType(NotesActions.updateNote),
      exhaustMap((action, value) => {
        return notesService.update(action.note).pipe(
          map((note: any) => NotesActions.updateNoteSuccess({ note })),
          catchError((error) => of(NotesActions.updateNoteFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const deleteNote = createEffect(
  (actions$ = inject(Actions), notesService = inject(NotesService)) => {
    return actions$.pipe(
      ofType(NotesActions.deleteNote),
      exhaustMap((action, value) => {
        return notesService.delete(action.note).pipe(
          map((note: any) => NotesActions.deleteNoteSuccess({ note })),
          catchError((error) => of(NotesActions.deleteNoteFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);
