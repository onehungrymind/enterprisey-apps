import { User } from '@proto/api-interfaces';
import { mockUser, mockUsersService } from '@proto/testing';
import { UsersService } from '@proto/users-data';
import { of, throwError } from 'rxjs';

import { UsersActions } from './users.actions';
import * as UsersEffects from './users.effects';

describe('UsersEffects', () => {
  const service = mockUsersService as unknown as UsersService;

  describe('loadUsers$', () => {
    it('should return loadUsersSuccess, on success', (done) => {
      const users: User[] = [];
      const action$ = of(UsersActions.loadUsers());

      service.all = jest.fn(() => of(users));

      UsersEffects.loadUsers(action$, service).subscribe((action) => {
        expect(action).toEqual(UsersActions.loadUsersSuccess({ users }));
        done();
      });
    });

    it('should return loadUsersFailure, on failure', (done) => {
      const error = new Error();
      const action$ = of(UsersActions.loadUsers());

      service.all = jest.fn(() => throwError(() => error));

      UsersEffects.loadUsers(action$, service).subscribe((action) => {
        expect(action).toEqual(UsersActions.loadUsersFailure({ error }));
        done();
      });
    });
  });

  describe('loadUser$', () => {
    it('should return success with user', (done) => {
      const user = { ...mockUser };
      const action$ = of(UsersActions.loadUser({ userId: user.id as string }));

      service.find = jest.fn(() => of(user));

      UsersEffects.loadUser(action$, service).subscribe((action) => {
        expect(action).toEqual(UsersActions.loadUserSuccess({ user }));
        done();
      });
    });

    it('should return failure', (done) => {
      const error = new Error();
      const user = { ...mockUser };
      const action$ = of(UsersActions.loadUser({ userId: user.id as string }));

      service.find = jest.fn(() => throwError(() => error));

      UsersEffects.loadUser(action$, service).subscribe((action) => {
        expect(action).toEqual(UsersActions.loadUserFailure({ error }));
        done();
      });
    });
  });

  describe('createUser$', () => {
    it('should return success with user', (done) => {
      const user = { ...mockUser };
      const action$ = of(UsersActions.createUser({ user }));

      mockUsersService.create = jest.fn(() => of(user));

      UsersEffects.createUser(action$, service).subscribe((action) => {
        expect(action).toEqual(UsersActions.createUserSuccess({ user }));
        done();
      });
    });

    it('should return failure', (done) => {
      const error = new Error();
      const user = { ...mockUser };
      const action$ = of(UsersActions.createUser({ user }));

      service.create = jest.fn(() => throwError(() => error));

      UsersEffects.createUser(action$, service).subscribe((action) => {
        expect(action).toEqual(UsersActions.createUserFailure({ error }));
        done();
      });
    });
  });

  describe('updateUser$', () => {
    it('should return success with user', (done) => {
      const user = { ...mockUser };
      const action$ = of(UsersActions.updateUser({ user }));

      mockUsersService.update = jest.fn(() => of(user));

      UsersEffects.updateUser(action$, service).subscribe((action) => {
        expect(action).toEqual(UsersActions.updateUserSuccess({ user }));
        done();
      });
    });

    it('should return failure', (done) => {
      const error = new Error();
      const user = { ...mockUser };
      const action$ = of(UsersActions.updateUser({ user }));

      service.update = jest.fn(() => throwError(() => error));

      UsersEffects.updateUser(action$, service).subscribe((action) => {
        expect(action).toEqual(UsersActions.updateUserFailure({ error }));
        done();
      });
    });
  });

  describe('deleteUser$', () => {
    it('should return success with user', (done) => {
      const user = { ...mockUser };
      const action$ = of(UsersActions.deleteUser({ user }));

      mockUsersService.delete = jest.fn(() => of(user));

      UsersEffects.deleteUser(action$, service).subscribe((action) => {
        expect(action).toEqual(UsersActions.deleteUserSuccess({ user }));
        done();
      });
    });

    it('should return failure', (done) => {
      const error = new Error();
      const user = { ...mockUser };
      const action$ = of(UsersActions.deleteUser({ user }));

      service.delete = jest.fn(() => throwError(() => error));

      UsersEffects.deleteUser(action$, service).subscribe((action) => {
        expect(action).toEqual(UsersActions.deleteUserFailure({ error }));
        done();
      });
    });
  });
});
