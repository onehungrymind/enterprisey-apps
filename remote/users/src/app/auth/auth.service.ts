import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../database/entities/user.entity';


type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private stripPassword(user: User): UserWithoutPassword {
    const { password, ...result } = user;
    return result;
  }

  async validateUser(email: string, pass: string): Promise<UserWithoutPassword> {
    const user = await this.usersService.findByEmail(email);
    const match = await bcrypt.compare(pass, user.password);

    if (match) {
      return this.stripPassword(user);
    }
    return null;
  }

  async validateToken(token: string): Promise<UserWithoutPassword> {
    try {
      const noBearer = token.replace('Bearer ', '');
      const payload = this.jwtService.verify(noBearer);
      return this.stripPassword(await this.usersService.findOne(payload.id))
    } catch (err) {
      return null;
    }
  }

  async login({ email }: { email: string }) {
    const user = await this.usersService.findByEmail(email);
    const payload = { email, id: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      user,
      access_token,
    };
  }
}
