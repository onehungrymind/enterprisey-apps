import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { ChallengesEffects, ChallengesState } from '@proto/challenges-state';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    providers: [
      provideEffects(ChallengesEffects),
      provideState(ChallengesState.CHALLENGES_FEATURE_KEY, ChallengesState.reducers),
    ],
  },
];
