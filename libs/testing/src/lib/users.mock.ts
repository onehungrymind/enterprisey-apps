/* eslint-disable @typescript-eslint/no-empty-function */
import { User, UserRoleEnum } from '@proto/api-interfaces';
import { of } from 'rxjs';

export const mockUsersFacade = {
  loadUsers: () => {},
  selectUser: () => {},
  deleteUser: () => {},
  updateUser: () => {},
  createUser: () => {},
};

export const mockUsersService = {
  all: () => of([]),
  find: () => of({ ...mockUser }),
  create: () => of({ ...mockUser }),
  update: () => of({ ...mockUser }),
  delete: () => of({ ...mockUser }),
};

export const mockUser: User = {
  id: '0',
  firstName: 'mock',
  lastName: 'mock',
  email: 'mock',
  password: 'mock',
  role: UserRoleEnum.USER,
  company_id: 'mock',
};

export const mockEmptyUser: User = {
  id: null,
  firstName: 'mockEmpty',
  lastName: 'mockEmpty',
  email: 'mockEmpty',
  password: 'mockEmpty',
  role: UserRoleEnum.USER,
  company_id: 'mockEmpty',
};
