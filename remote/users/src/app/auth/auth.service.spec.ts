import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { mockUser } from '@proto/testing';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  const user = { ...mockUser } as User;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UsersService,
        {
          provide: 'USER_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('validateUser() true', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce({
      ...user,
      password: bcrypt.hashSync('mock', 10),
    });
    const result = await service.validateUser(user.email, user.password);
    const { password, ...rest } = result;
    expect(result).toStrictEqual(rest);
  });
  it('validateUser() false', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce({
      ...user,
      password: bcrypt.hashSync('invalid', 10),
    });
    const result = await service.validateUser(user.email, user.password);
    expect(result).toBeNull();
  });
  it('login()', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(user);
    jest
      .spyOn(jwtService, 'sign')
      .mockResolvedValueOnce({ email: user.email, id: user.id } as never);
    const result = await service.login({ email: user.email });
    expect(result).toMatchObject({ user, access_token: {} });
  });
});
