import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Flashcard } from '@proto/api-interfaces';
import { FlashcardsService } from '@proto/flashcards-data';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { FlashcardsActions } from './flashcards.actions';

export const loadFlashcards = createEffect(
  (actions$ = inject(Actions), flashcardsService = inject(FlashcardsService)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.loadFlashcards),
      exhaustMap((action, value) =>
        flashcardsService.all().pipe(
          map((flashcards: Flashcard[]) => FlashcardsActions.loadFlashcardsSuccess({ flashcards })),
          catchError((error) => of(FlashcardsActions.loadFlashcardsFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loadFlashcard = createEffect(
  (actions$ = inject(Actions), flashcardsService = inject(FlashcardsService)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.loadFlashcard),
      exhaustMap((action, value) => {
        return flashcardsService.find(action.flashcardId).pipe(
          map((flashcard: Flashcard) => FlashcardsActions.loadFlashcardSuccess({ flashcard })),
          catchError((error) => of(FlashcardsActions.loadFlashcardFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const createFlashcard = createEffect(
  (actions$ = inject(Actions), flashcardsService = inject(FlashcardsService)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.createFlashcard),
      exhaustMap((action, value) => {
        return flashcardsService.create(action.flashcard).pipe(
          map((flashcard: any) => FlashcardsActions.createFlashcardSuccess({ flashcard })),
          catchError((error) => of(FlashcardsActions.createFlashcardFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const updateFlashcard = createEffect(
  (actions$ = inject(Actions), flashcardsService = inject(FlashcardsService)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.updateFlashcard),
      exhaustMap((action, value) => {
        return flashcardsService.update(action.flashcard).pipe(
          map((flashcard: any) => FlashcardsActions.updateFlashcardSuccess({ flashcard })),
          catchError((error) => of(FlashcardsActions.updateFlashcardFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const deleteFlashcard = createEffect(
  (actions$ = inject(Actions), flashcardsService = inject(FlashcardsService)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.deleteFlashcard),
      exhaustMap((action, value) => {
        return flashcardsService.delete(action.flashcard).pipe(
          map((flashcard: any) => FlashcardsActions.deleteFlashcardSuccess({ flashcard })),
          catchError((error) => of(FlashcardsActions.deleteFlashcardFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);
