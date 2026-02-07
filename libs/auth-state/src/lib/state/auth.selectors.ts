import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY } from './state';
import { AuthState } from './auth.reducer';

export const getAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const getUser = createSelector(getAuthState, (state) => state.user);

export const getToken = createSelector(getAuthState, (state) => state.token);

export const getLoading = createSelector(getAuthState, (state) => state.loading);

export const getError = createSelector(getAuthState, (state) => state.error);

export const getInitialized = createSelector(
  getAuthState,
  (state) => state.initialized
);

export const getIsAuthenticated = createSelector(
  getAuthState,
  (state) => !!state.token && !!state.user
);
