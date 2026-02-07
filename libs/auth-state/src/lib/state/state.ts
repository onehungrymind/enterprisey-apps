import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const AUTH_FEATURE_KEY = 'auth';

export interface State {
  auth: fromAuth.AuthState;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
};

export const getAuthFeatureState = createFeatureSelector<State>(AUTH_FEATURE_KEY);
