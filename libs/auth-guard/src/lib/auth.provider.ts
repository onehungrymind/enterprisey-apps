import { EnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AuthState, AuthEffects } from '@proto/auth-state';

export function provideAuth(): EnvironmentProviders[] {
  return [
    provideState(AuthState.AUTH_FEATURE_KEY, AuthState.reducers),
    provideEffects(AuthEffects),
  ];
}
