import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { UsersEffects, UsersState } from '@proto/users-state';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    providers: [
      provideEffects(UsersEffects),
      provideState(UsersState.USERS_FEATURE_KEY, UsersState.reducers),
    ],
  },
];
