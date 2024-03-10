import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Challenge } from '@proto/api-interfaces';
import { ChallengesService } from '@proto/challenges-data';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { ChallengesActions } from './challenges.actions';

export const loadChallenges = createEffect(
  (actions$ = inject(Actions), challengesService = inject(ChallengesService)) => {
    return actions$.pipe(
      ofType(ChallengesActions.loadChallenges),
      exhaustMap((action, value) =>
        challengesService.all().pipe(
          map((challenges: Challenge[]) => ChallengesActions.loadChallengesSuccess({ challenges })),
          catchError((error) => of(ChallengesActions.loadChallengesFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loadChallenge = createEffect(
  (actions$ = inject(Actions), challengesService = inject(ChallengesService)) => {
    return actions$.pipe(
      ofType(ChallengesActions.loadChallenge),
      exhaustMap((action, value) => {
        return challengesService.find(action.challengeId).pipe(
          map((challenge: Challenge) => ChallengesActions.loadChallengeSuccess({ challenge })),
          catchError((error) => of(ChallengesActions.loadChallengeFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const createChallenge = createEffect(
  (actions$ = inject(Actions), challengesService = inject(ChallengesService)) => {
    return actions$.pipe(
      ofType(ChallengesActions.createChallenge),
      exhaustMap((action, value) => {
        return challengesService.create(action.challenge).pipe(
          map((challenge: any) => ChallengesActions.createChallengeSuccess({ challenge })),
          catchError((error) => of(ChallengesActions.createChallengeFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const updateChallenge = createEffect(
  (actions$ = inject(Actions), challengesService = inject(ChallengesService)) => {
    return actions$.pipe(
      ofType(ChallengesActions.updateChallenge),
      exhaustMap((action, value) => {
        return challengesService.update(action.challenge).pipe(
          map((challenge: any) => ChallengesActions.updateChallengeSuccess({ challenge })),
          catchError((error) => of(ChallengesActions.updateChallengeFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const deleteChallenge = createEffect(
  (actions$ = inject(Actions), challengesService = inject(ChallengesService)) => {
    return actions$.pipe(
      ofType(ChallengesActions.deleteChallenge),
      exhaustMap((action, value) => {
        return challengesService.delete(action.challenge).pipe(
          map((challenge: any) => ChallengesActions.deleteChallengeSuccess({ challenge })),
          catchError((error) => of(ChallengesActions.deleteChallengeFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);
