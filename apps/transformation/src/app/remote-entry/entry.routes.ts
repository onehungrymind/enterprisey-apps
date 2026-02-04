import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { PipelinesEffects, PipelinesState } from '@proto/transformation-state';

import { PipelinesComponent } from '../pipelines/pipelines.component';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    providers: [
      provideEffects(PipelinesEffects),
      provideState(PipelinesState.PIPELINES_FEATURE_KEY, PipelinesState.reducers),
    ],
    children: [
      {
        path: '',
        component: PipelinesComponent,
      },
    ],
  },
];
