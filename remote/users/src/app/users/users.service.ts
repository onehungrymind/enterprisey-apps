import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ id });
  }

  async get(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  async create(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async update(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<DeleteResult> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return await this.usersRepository.delete(id);
  }
}
