import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockEmptyUser, mockUser } from '@proto/testing';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UsersService } from './users.service';
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  const user = { ...mockUser } as User;
  const emptyUser = { ...mockEmptyUser } as User;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>('USER_REPOSITORY');
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('find() on service.findAll()', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce([user]);
    const result = await service.findAll();
    expect(result).toStrictEqual([user]);
  });
  it('findOneBy() on service.findOne()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(user);
    const result = await service.findOne(user.id);
    expect(result).toStrictEqual(user);
  });
  it('findOneBy() on service.get()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(user);
    const result = await service.get(user.id);
    expect(result).toStrictEqual(user);
  });
  it('findOneBy() on service.get() error', async () => {
    jest
      .spyOn(repository, 'findOneBy')
      .mockRejectedValueOnce(new NotFoundException());
    await expect(service.get(user.id)).rejects.toThrow(NotFoundException);
  });
  it('save() on service.update()', async () => {
    jest.spyOn(repository, 'save').mockResolvedValueOnce(user);
    const result = await service.update(user);
    expect(result).toStrictEqual(user);
  });
  it('delete() on service.remove()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(user);
    jest.spyOn(repository, 'delete').mockResolvedValueOnce({} as DeleteResult);
    const result = await service.remove(user.id);
    expect(result).toStrictEqual({});
  });
  it('delete() on service.remove() error', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(undefined);
    await expect(service.remove(user.id)).rejects.toThrow(NotFoundException);
  });
  it('findOneBy() on service.findByEmail()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(user);
    const result = await service.findByEmail(user.email);
    expect(result).toStrictEqual(user);
    expect(repository.findOneBy).toHaveBeenCalledWith({
      email: 'mock',
    });
  });
  it('save() on service.create()', async () => {
    jest.spyOn(repository, 'save').mockResolvedValueOnce(emptyUser);
    const result = await service.create(emptyUser);
    expect(result).toStrictEqual(emptyUser);
  });
});
