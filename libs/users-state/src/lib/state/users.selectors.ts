import { createSelector } from '@ngrx/store';
import { getUsersState } from './state';
import { UsersState, usersAdapter } from './users.reducer';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = usersAdapter.getSelectors();

const getUsersSlice = createSelector(getUsersState, (state) => state.users);

export const getUserIds = createSelector(getUsersSlice, selectIds);
export const getUsersEntities = createSelector(getUsersSlice, selectEntities);
export const getAllUsers = createSelector(getUsersSlice, selectAll);
export const getUsersTotal = createSelector(getUsersSlice, selectTotal);
export const getSelectedUserId = createSelector(getUsersSlice, (state: UsersState) => state.selectedId);

export const getUsersLoaded = createSelector(
  getUsersSlice,
  (state: UsersState) => state.loaded
);

export const getUsersError = createSelector(
  getUsersSlice,
  (state: UsersState) => state.error
);

export const getSelectedUser = createSelector(
  getUsersEntities,
  getSelectedUserId,
  (entities, selectedId) => selectedId && entities[selectedId]
);

// Companies selectors
export const getAllCompanies = createSelector(
  getUsersSlice,
  (state: UsersState) => state.companies
);

export const getCompaniesLoaded = createSelector(
  getUsersSlice,
  (state: UsersState) => state.companiesLoaded
);
