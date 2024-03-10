import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as ChallengesActions from './challenges.actions';
import * as ChallengesFeature from './challenges.reducer';

@Injectable()
export class ChallengesEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChallengesActions.initChallenges),
      switchMap(() =>
        of(ChallengesActions.loadChallengesSuccess({ challenges: [] }))
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(ChallengesActions.loadChallengesFailure({ error }));
      })
    )
  );
}
