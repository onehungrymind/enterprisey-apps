import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const match = await bcrypt.compare(pass, user.password);

    if (match) {
      // strip the password property from the user object
      const { password, ...result } = user;
      return result;
    }
    return null;
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
