import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { User, Company } from '@proto/api-interfaces';

import { UsersActions } from './users.actions';

export interface UsersState extends EntityState<User> {
  selectedId?: string | undefined;
  error?: string | null;
  loaded: boolean;
  companies: Company[];
  companiesLoaded: boolean;
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialUsersState: UsersState = usersAdapter.getInitialState({
  loaded: false,
  companies: [],
  companiesLoaded: false,
});

const onFailure = (state: UsersState, { error }: any) => {
  console.log(error);
  return { ...state, error };
};

export const reducer = createReducer(
  initialUsersState,
  // Companies
  on(UsersActions.loadCompanies, (state) => ({
    ...state,
    companiesLoaded: false,
  })),
  on(UsersActions.loadCompaniesSuccess, (state, { companies }) => ({
    ...state,
    companies,
    companiesLoaded: true,
  })),
  on(UsersActions.loadCompaniesFailure, (state, { error }) => ({
    ...state,
    error,
    companiesLoaded: false,
  })),
  on(UsersActions.createCompanySuccess, (state, { company }) => ({
    ...state,
    companies: [...state.companies, company],
  })),
  on(UsersActions.updateCompanySuccess, (state, { company }) => ({
    ...state,
    companies: state.companies.map(c => c.id === company.id ? company : c),
  })),
  on(UsersActions.deleteCompanySuccess, (state, { company }) => ({
    ...state,
    companies: state.companies.filter(c => c.id !== company.id),
  })),
  // Users
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(UsersActions.loadUser, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  // RESET
  on(UsersActions.selectUser, (state, { selectedId }) =>
    Object.assign({}, state, { selectedId })
  ),
  on(UsersActions.resetSelectedUser, (state) =>
    Object.assign({}, state, { selectedId: null })
  ),
  on(UsersActions.resetUsers, (state) => usersAdapter.removeAll(state)),
  // CRUD
  on(UsersActions.loadUsersSuccess, (state, { users }) =>
    usersAdapter.setAll(users, { ...state, loaded: true })
  ),
  on(UsersActions.loadUserSuccess, (state, { user }) =>
    usersAdapter.upsertOne(user, { ...state, loaded: true })
  ),
  on(UsersActions.createUserSuccess, (state, { user }) =>
    usersAdapter.addOne(user, state)
  ),
  on(UsersActions.updateUserSuccess, (state, { user }) =>
    usersAdapter.updateOne({ id: user.id || '', changes: user }, state)
  ),
  on(UsersActions.deleteUserSuccess, (state, { user }) =>
    usersAdapter.removeOne(user?.id ?? '', state)
  ),
  // FAILURE
  on(
    UsersActions.loadUsersFailure,
    UsersActions.loadUserFailure,
    UsersActions.createUserFailure,
    UsersActions.createUserFailure,
    UsersActions.createUserFailure,
    UsersActions.updateUserFailure,
    UsersActions.deleteUserFailure,
    onFailure
  )
);
