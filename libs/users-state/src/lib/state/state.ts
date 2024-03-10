import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromUsers from './users.reducer';

export const USERS_FEATURE_KEY = 'users';

export interface State {
  users: fromUsers.UsersState;
}

export const reducers: ActionReducerMap<State> = {
  users: fromUsers.reducer,
};

export const getUsersState =
  createFeatureSelector<State>(USERS_FEATURE_KEY);
