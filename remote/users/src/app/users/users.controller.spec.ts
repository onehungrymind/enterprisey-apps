import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { mockEmptyUser, mockUser } from '@proto/testing';
import { DeleteResult, Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { User } from '../database/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let authService: AuthService;

  const user = { ...mockUser } as User;
  const emptyUser = { ...mockEmptyUser } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: 'USER_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login()', async () => {
    jest
      .spyOn(authService, 'login')
      .mockResolvedValueOnce({ access_token: 'access-token', user });

    const result = await controller.login({ email: emptyUser.email });

    expect(result).toStrictEqual({ access_token: 'access-token', user });
  });

  it('findByEmail()', async () => {
    jest.spyOn(service, 'findByEmail').mockResolvedValueOnce(user);

    const result = await service.findByEmail(user.email);

    expect(result).toStrictEqual(user);
  });

  it('create()', async () => {
    jest.spyOn(service, 'create').mockResolvedValueOnce(user);

    const result = await controller.create(emptyUser);

    expect(result).toStrictEqual(user);
  });

  it('findAll()', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([user]);

    const result = await controller.findAll();

    expect(result).toStrictEqual([user]);
  });

  it('findOne()', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);

    const result = await service.findOne(user.id);

    expect(result).toStrictEqual(user);
  });

  it('update()', async () => {
    jest.spyOn(service, 'update').mockResolvedValueOnce(user);

    const result = await controller.update(user.id, user);

    expect(result).toStrictEqual(user);
  });

  it('remove()', async () => {
    jest.spyOn(service, 'remove').mockResolvedValueOnce({} as DeleteResult);

    const result = await controller.remove(user.id);

    expect(result).toStrictEqual({});
  });
});
