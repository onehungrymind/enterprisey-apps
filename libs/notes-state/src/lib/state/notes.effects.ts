import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as NotesActions from './notes.actions';
import * as NotesFeature from './notes.reducer';

@Injectable()
export class NotesEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesActions.initNotes),
      switchMap(() => of(NotesActions.loadNotesSuccess({ notes: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(NotesActions.loadNotesFailure({ error }));
      })
    )
  );
}
