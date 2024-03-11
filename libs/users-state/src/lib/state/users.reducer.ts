import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { User } from '@proto/api-interfaces';

import { UsersActions } from './users.actions';

export interface UsersState extends EntityState<User> {
  selectedId?: string | undefined;
  error?: string | null;
  loaded: boolean;
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialUsersState: UsersState = usersAdapter.getInitialState({
  loaded: false,
});

const onFailure = (state: UsersState, { error }: any) => {
  console.log(error);
  return { ...state, error };
};

export const reducer = createReducer(
  initialUsersState,
  // TBD
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
