import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { SourcesEffects, SourcesState } from '@proto/ingress-state';

import { SourcesComponent } from '../sources/sources.component';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    providers: [
      provideEffects(SourcesEffects),
      provideState(SourcesState.SOURCES_FEATURE_KEY, SourcesState.reducers),
    ],
    children: [
      {
        path: '',
        component: SourcesComponent,
      },
    ],
  },
];
