import { createReducer, on } from '@ngrx/store';
import { User } from '@proto/api-interfaces';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  initialized: false,
};

export const reducer = createReducer(
  initialAuthState,
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null,
    initialized: true,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    initialized: true,
  })),
  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.logoutComplete, () => ({
    ...initialAuthState,
    initialized: true,
  })),
  // Check Auth (on app init)
  on(AuthActions.checkAuth, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.checkAuthSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    initialized: true,
  })),
  on(AuthActions.checkAuthFailure, (state) => ({
    ...state,
    user: null,
    token: null,
    loading: false,
    initialized: true,
  }))
);
