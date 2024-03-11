import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Feature } from '@proto/api-interfaces';
import { FeaturesService } from '@proto/features-data';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { FeaturesActions } from './features.actions';

export const loadFeatures = createEffect(
  (actions$ = inject(Actions), featuresService = inject(FeaturesService)) => {
    return actions$.pipe(
      ofType(FeaturesActions.loadFeatures),
      exhaustMap((action, value) =>
        featuresService.all().pipe(
          map((features: Feature[]) =>
            FeaturesActions.loadFeaturesSuccess({ features })
          ),
          catchError((error) =>
            of(FeaturesActions.loadFeaturesFailure({ error }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const loadFeature = createEffect(
  (actions$ = inject(Actions), featuresService = inject(FeaturesService)) => {
    return actions$.pipe(
      ofType(FeaturesActions.loadFeature),
      exhaustMap((action, value) => {
        return featuresService.find(action.featureId).pipe(
          map((feature: Feature) =>
            FeaturesActions.loadFeatureSuccess({ feature })
          ),
          catchError((error) =>
            of(FeaturesActions.loadFeatureFailure({ error }))
          )
        );
      })
    );
  },
  { functional: true }
);

export const createFeature = createEffect(
  (actions$ = inject(Actions), featuresService = inject(FeaturesService)) => {
    return actions$.pipe(
      ofType(FeaturesActions.createFeature),
      exhaustMap((action, value) => {
        return featuresService.create(action.feature).pipe(
          map((feature: any) =>
            FeaturesActions.createFeatureSuccess({ feature })
          ),
          catchError((error) =>
            of(FeaturesActions.createFeatureFailure({ error }))
          )
        );
      })
    );
  },
  { functional: true }
);

export const updateFeature = createEffect(
  (actions$ = inject(Actions), featuresService = inject(FeaturesService)) => {
    return actions$.pipe(
      ofType(FeaturesActions.updateFeature),
      exhaustMap((action, value) => {
        return featuresService.update(action.feature).pipe(
          map((feature: any) =>
            FeaturesActions.updateFeatureSuccess({ feature })
          ),
          catchError((error) =>
            of(FeaturesActions.updateFeatureFailure({ error }))
          )
        );
      })
    );
  },
  { functional: true }
);

export const deleteFeature = createEffect(
  (actions$ = inject(Actions), featuresService = inject(FeaturesService)) => {
    return actions$.pipe(
      ofType(FeaturesActions.deleteFeature),
      exhaustMap((action, value) => {
        return featuresService.delete(action.feature).pipe(
          map((feature: any) =>
            FeaturesActions.deleteFeatureSuccess({ feature })
          ),
          catchError((error) =>
            of(FeaturesActions.deleteFeatureFailure({ error }))
          )
        );
      })
    );
  },
  { functional: true }
);
