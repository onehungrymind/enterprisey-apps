import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataSource, DataSchema } from '@proto/api-interfaces';
import { SourcesService } from '@proto/ingress-data';
import { of, timer } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, takeUntil } from 'rxjs/operators';
import { SourcesActions } from './sources.actions';

export const loadSources = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(SourcesActions.loadSources),
      exhaustMap(() =>
        sourcesService.all().pipe(
          map((sources: DataSource[]) => SourcesActions.loadSourcesSuccess({ sources })),
          catchError((error) => of(SourcesActions.loadSourcesFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loadSource = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(SourcesActions.loadSource),
      exhaustMap((action) =>
        sourcesService.find(action.sourceId).pipe(
          map((source: DataSource) => SourcesActions.loadSourceSuccess({ source })),
          catchError((error) => of(SourcesActions.loadSourceFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const createSource = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(SourcesActions.createSource),
      exhaustMap((action) =>
        sourcesService.create(action.source).pipe(
          map((source: DataSource) => SourcesActions.createSourceSuccess({ source })),
          catchError((error) => of(SourcesActions.createSourceFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const updateSource = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(SourcesActions.updateSource),
      exhaustMap((action) =>
        sourcesService.update(action.source).pipe(
          map((source: DataSource) => SourcesActions.updateSourceSuccess({ source })),
          catchError((error) => of(SourcesActions.updateSourceFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const deleteSource = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(SourcesActions.deleteSource),
      exhaustMap((action) =>
        sourcesService.delete(action.source).pipe(
          map(() => SourcesActions.deleteSourceSuccess({ source: action.source })),
          catchError((error) => of(SourcesActions.deleteSourceFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const testConnection = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(SourcesActions.testConnection),
      exhaustMap((action) =>
        sourcesService.testConnection(action.sourceId).pipe(
          map((source: DataSource) => SourcesActions.testConnectionSuccess({ source })),
          catchError((error) => of(SourcesActions.testConnectionFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

// After test connection dispatches, poll for status updates
export const pollAfterTestConnection = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(SourcesActions.testConnectionSuccess),
      switchMap((action) =>
        timer(2000, 2000).pipe(
          takeUntil(actions$.pipe(ofType(SourcesActions.loadSources, SourcesActions.resetSources))),
          switchMap(() =>
            sourcesService.find(action.source.id as string).pipe(
              map((source) => {
                if (source.status !== 'testing') {
                  return SourcesActions.statusUpdate({ source });
                }
                return SourcesActions.statusUpdate({ source });
              }),
              catchError(() => of(SourcesActions.loadSourcesFailure({ error: 'Poll failed' })))
            )
          )
        )
      )
    );
  },
  { functional: true }
);

export const syncSource = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(SourcesActions.syncSource),
      exhaustMap((action) =>
        sourcesService.sync(action.sourceId).pipe(
          map((source: DataSource) => SourcesActions.syncSourceSuccess({ source })),
          catchError((error) => of(SourcesActions.syncSourceFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loadSchema = createEffect(
  (actions$ = inject(Actions), sourcesService = inject(SourcesService)) => {
    return actions$.pipe(
      ofType(SourcesActions.loadSchema),
      exhaustMap((action) =>
        sourcesService.getSchema(action.sourceId).pipe(
          map((schema: DataSchema) => SourcesActions.loadSchemaSuccess({ schema })),
          catchError((error) => of(SourcesActions.loadSchemaFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);
