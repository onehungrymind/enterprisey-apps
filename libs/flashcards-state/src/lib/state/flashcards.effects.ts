import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as FlashcardsActions from './flashcards.actions';
import * as FlashcardsFeature from './flashcards.reducer';

@Injectable()
export class FlashcardsEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlashcardsActions.initFlashcards),
      switchMap(() =>
        of(FlashcardsActions.loadFlashcardsSuccess({ flashcards: [] }))
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(FlashcardsActions.loadFlashcardsFailure({ error }));
      })
    )
  );
}
