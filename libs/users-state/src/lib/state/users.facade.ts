import { Injectable, inject } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { User } from '@proto/api-interfaces';
import { UsersActions } from './users.actions';
import * as UsersSelectors from './users.selectors';

@Injectable({
  providedIn: 'root',
})
export class UsersFacade {
  private readonly store = inject(Store);

  loaded$ = this.store.pipe(select(UsersSelectors.getUsersLoaded));
  allUsers$ = this.store.pipe(select(UsersSelectors.getAllUsers));
  selectedUser$ = this.store.pipe(select(UsersSelectors.getSelectedUser));

  resetSelectedUser() {
    this.dispatch(UsersActions.resetSelectedUser());
  }

  selectUser(selectedId: string) {
    this.dispatch(UsersActions.selectUser({ selectedId }));
  }

  loadUsers() {
    this.dispatch(UsersActions.loadUsers());
  }

  loadUser(userId: string) {
    this.dispatch(UsersActions.loadUser({ userId }));
  }

  saveUser(user: User) {
    if (user.id) {
      this.updateUser(user);
    } else {
      this.createUser(user);
    }
  }

  createUser(user: User) {
    this.dispatch(UsersActions.createUser({ user }));
  }

  updateUser(user: User) {
    this.dispatch(UsersActions.updateUser({ user }));
  }

  deleteUser(user: User) {
    this.dispatch(UsersActions.deleteUser({ user }));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
