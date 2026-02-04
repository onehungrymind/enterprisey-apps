import { TestBed } from '@angular/core/testing';
import { ActionsSubject } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { mockUser } from '@proto/testing';
import { UsersActions } from './users.actions';
import { UsersFacade } from './users.facade';
import { initialUsersState } from './users.reducer';
describe('UsersFacade', () => {
  let facade: UsersFacade;
  let store: MockStore;
  const mockActionsSubject = new ActionsSubject();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersFacade,
        provideMockStore({ initialState: initialUsersState }),
        { provide: ActionsSubject, useValue: mockActionsSubject },
      ],
    });
    facade = TestBed.inject(UsersFacade);
    store = TestBed.inject(MockStore);
  });
  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
  describe('should dispatch', () => {
    it('select on select(user.id)', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.selectUser(mockUser.id as string);
      const action = UsersActions.selectUser({
        selectedId: mockUser.id as string,
      });
      expect(spy).toHaveBeenCalledWith(action);
    });
    it('loadUsers on loadUsers()', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.loadUsers();
      const action = UsersActions.loadUsers();
      expect(spy).toHaveBeenCalledWith(action);
    });
    it('loadUser on loadUser(user.id)', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.loadUser(mockUser.id as string);
      const action = UsersActions.loadUser({ userId: mockUser.id as string });
      expect(spy).toHaveBeenCalledWith(action);
    });
    it('createUser on createUser(user)', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.createUser(mockUser);
      const action = UsersActions.createUser({ user: mockUser });
      expect(spy).toHaveBeenCalledWith(action);
    });
    it('updateUser on updateUser(user)', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.updateUser(mockUser);
      const action = UsersActions.updateUser({ user: mockUser });
      expect(spy).toHaveBeenCalledWith(action);
    });
    it('delete on delete(model)', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.deleteUser(mockUser);
      const action = UsersActions.deleteUser({ user: mockUser });
      expect(spy).toHaveBeenCalledWith(action);
    });
  });
});
