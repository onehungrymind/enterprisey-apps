import { User } from '@proto/api-interfaces';
import { mockUser } from '@proto/testing';

import { initialUsersState, usersAdapter, UsersState } from './users.reducer';
import * as UsersSelectors from './users.selectors';

describe('Users Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getUsersId = (user: User) => user['id'];
  const createUser = (id: string, name = '') =>
    ({ ...mockUser, id: id } as User);

  let state: UsersState;

  beforeEach(() => {
    state = usersAdapter.setAll(
      [
        createUser('PRODUCT-AAA'),
        createUser('PRODUCT-BBB'),
        createUser('PRODUCT-CCC'),
      ],
      {
        ...initialUsersState,
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true,
      }
    );
  });

  describe('Users Selectors', () => {
    it('getAllUsers() should return the list of Users', () => {
      const results = UsersSelectors.getAllUsers.projector(state);
      const selId = getUsersId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected schema', () => {
      const result = UsersSelectors.getSelectedUser.projector(
        state.entities,
        state.selectedId
      );
      const selId = getUsersId(result as User);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getUsersLoaded() should return the current 'loaded' status", () => {
      const result = UsersSelectors.getUsersLoaded.projector(state);

      expect(result).toBe(true);
    });

    it("getUsersError() should return the current 'error' state", () => {
      const result = UsersSelectors.getUsersError.projector(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
