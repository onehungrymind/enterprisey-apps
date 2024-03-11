import { Route } from '@angular/router';
import { FeaturesComponent } from './features/features.component';
import { FeaturesEffects, FeaturesState } from '@proto/features-state';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

export const appRoutes: Route[] = [
  {
    path: '',
    component: FeaturesComponent,
    providers: [
      provideEffects(FeaturesEffects),
      provideState(FeaturesState.FEATURES_FEATURE_KEY, FeaturesState.reducers),
    ],
  },
];
