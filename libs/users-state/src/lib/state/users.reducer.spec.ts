import { User } from '@proto/api-interfaces';
import { mockEmptyUser, mockUser } from '@proto/testing';
import { UsersActions } from './users.actions';
import { initialUsersState, reducer, UsersState } from './users.reducer';
describe('Users Reducer', () => {
  let users: User[];
  beforeEach(() => {
    users = [
      { ...mockUser, id: '0' },
      { ...mockUser, id: '1' },
      { ...mockUser, id: '2' },
    ];
  });
  describe('valid Users actions', () => {
    it('loadUsers should set loaded to false', () => {
      const action = UsersActions.loadUsers();
      const expectedState = {
        ...initialUsersState,
        error: null,
      };
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadUsersSuccess should set the list of known Users', () => {
      const action = UsersActions.loadUsersSuccess({ users });
      const expectedState = {
        ...initialUsersState,
        loaded: true,
        entities: {
          0: users[0],
          1: users[1],
          2: users[2],
        },
        ids: users.map((user) => user.id),
      };
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadUsersFailure should set error to error', () => {
      const error = new Error();
      const action = UsersActions.loadUsersFailure({ error });
      const expectedState = {
        ...initialUsersState,
        error,
      };
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadUser should set loaded to false', () => {
      const action = UsersActions.loadUser({ userId: mockUser.id as string });
      const expectedState = {
        ...initialUsersState,
        loaded: false,
        error: null,
      };
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadUserSuccess should set loaded to true', () => {
      const action = UsersActions.loadUserSuccess({ user: mockUser });
      const expectedState = {
        ...initialUsersState,
        loaded: true,
        entities: {
          0: mockUser,
        },
        ids: [mockUser.id],
      };
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadUserFailure should set error to error', () => {
      const error = new Error();
      const action = UsersActions.loadUserFailure({ error });
      const expectedState = {
        ...initialUsersState,
        error,
      };
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('updateUserSuccess should modify user', () => {
      const prepAction = UsersActions.loadUserSuccess({
        user: { ...mockEmptyUser, id: mockUser.id },
      });
      const prepState: UsersState = reducer(initialUsersState, prepAction);
      const expectedState = {
        ...initialUsersState,
        loaded: true,
        entities: {
          0: mockUser,
        },
        ids: [mockUser.id],
      };
      const action = UsersActions.updateUserSuccess({ user: mockUser });
      const result: UsersState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('updateUserFailure should set error to error', () => {
      const error = new Error();
      const action = UsersActions.updateUserFailure({ error });
      const expectedState = {
        ...initialUsersState,
        error: error,
      };
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('createUserSuccess should add user', () => {
      const action = UsersActions.createUserSuccess({ user: mockUser });
      const expectedState = {
        ...initialUsersState,
        loaded: false,
        entities: {
          0: mockUser,
        },
        ids: [mockUser.id],
      };
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('createUserFailure should set error to error', () => {
      const error = new Error();
      const action = UsersActions.createUserFailure({ error });
      const expectedState = {
        ...initialUsersState,
        error,
      };
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('deleteUserSuccess should add user', () => {
      const prepAction = UsersActions.loadUserSuccess({
        user: mockUser,
      });
      const prepState: UsersState = reducer(initialUsersState, prepAction);
      const expectedState = {
        ...initialUsersState,
        loaded: true,
      };
      const action = UsersActions.deleteUserSuccess({ user: mockUser });
      const result: UsersState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('deleteUserFailure should set error to error', () => {
      const error = new Error();
      const action = UsersActions.deleteUserFailure({ error });
      const expectedState = {
        ...initialUsersState,
        error,
      };
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('selectUser should set selectedId', () => {
      const action = UsersActions.selectUser({
        selectedId: mockUser.id as string,
      });
      const expectedState = {
        ...initialUsersState,
        selectedId: mockUser.id,
      };
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('resetSelectedUser should reset selectedId', () => {
      const prepAction = UsersActions.selectUser({
        selectedId: mockUser.id as string,
      });
      const prepState = reducer(initialUsersState, prepAction);
      const action = UsersActions.resetSelectedUser();
      const expectedState = {
        ...initialUsersState,
        selectedId: null,
      };
      const result: UsersState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('resetUsers should reset users', () => {
      const prepAction = UsersActions.loadUsersSuccess({ users });
      const prepState: UsersState = reducer(initialUsersState, prepAction);
      const expectedState = {
        ...initialUsersState,
        loaded: true,
      };
      const action = UsersActions.resetUsers();
      const result: UsersState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
  });
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result: UsersState = reducer(initialUsersState, action);
      expect(result).toBe(initialUsersState);
    });
  });
});
