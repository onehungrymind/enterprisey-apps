import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../database/entities/user.entity';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  private stripPassword(user: User): UserWithoutPassword {
    const { password, ...result } = user;
    return result;
  }

  async validateUser(
    email: string,
    pass: string
  ): Promise<UserWithoutPassword> {
    const user = await this.usersService.findByEmail(email);
    const match = await bcrypt.compare(pass, user.password);

    if (match) {
      return this.stripPassword(user);
    }
    return null;
  }

  async login({ email }: { email: string }) {
    const user = await this.usersService.findByEmail(email);
    const payload: JwtPayload = {
      email,
      sub: user.id,
      aud: 'user',
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      user: this.stripPassword(user),
      access_token,
    };
  }
}
