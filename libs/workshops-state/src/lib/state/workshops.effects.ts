import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Workshop } from '@proto/api-interfaces';
import { WorkshopsService } from '@proto/workshops-data';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { WorkshopsActions } from './workshops.actions';

export const loadWorkshops = createEffect(
  (actions$ = inject(Actions), workshopsService = inject(WorkshopsService)) => {
    return actions$.pipe(
      ofType(WorkshopsActions.loadWorkshops),
      exhaustMap((action, value) =>
        workshopsService.all().pipe(
          map((workshops: Workshop[]) => WorkshopsActions.loadWorkshopsSuccess({ workshops })),
          catchError((error) => of(WorkshopsActions.loadWorkshopsFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loadWorkshop = createEffect(
  (actions$ = inject(Actions), workshopsService = inject(WorkshopsService)) => {
    return actions$.pipe(
      ofType(WorkshopsActions.loadWorkshop),
      exhaustMap((action, value) => {
        return workshopsService.find(action.workshopId).pipe(
          map((workshop: Workshop) => WorkshopsActions.loadWorkshopSuccess({ workshop })),
          catchError((error) => of(WorkshopsActions.loadWorkshopFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const createWorkshop = createEffect(
  (actions$ = inject(Actions), workshopsService = inject(WorkshopsService)) => {
    return actions$.pipe(
      ofType(WorkshopsActions.createWorkshop),
      exhaustMap((action, value) => {
        return workshopsService.create(action.workshop).pipe(
          map((workshop: any) => WorkshopsActions.createWorkshopSuccess({ workshop })),
          catchError((error) => of(WorkshopsActions.createWorkshopFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const updateWorkshop = createEffect(
  (actions$ = inject(Actions), workshopsService = inject(WorkshopsService)) => {
    return actions$.pipe(
      ofType(WorkshopsActions.updateWorkshop),
      exhaustMap((action, value) => {
        return workshopsService.update(action.workshop).pipe(
          map((workshop: any) => WorkshopsActions.updateWorkshopSuccess({ workshop })),
          catchError((error) => of(WorkshopsActions.updateWorkshopFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const deleteWorkshop = createEffect(
  (actions$ = inject(Actions), workshopsService = inject(WorkshopsService)) => {
    return actions$.pipe(
      ofType(WorkshopsActions.deleteWorkshop),
      exhaustMap((action, value) => {
        return workshopsService.delete(action.workshop).pipe(
          map((workshop: any) => WorkshopsActions.deleteWorkshopSuccess({ workshop })),
          catchError((error) => of(WorkshopsActions.deleteWorkshopFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);
