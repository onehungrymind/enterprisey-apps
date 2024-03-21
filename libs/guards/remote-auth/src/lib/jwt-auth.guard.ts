import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as process from 'process';

const auth_url = process.env['AUTH_URL'] || 'http://localhost:3400';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return false;
    }

    const token = request.headers.authorization.split(' ')[1];

    const res = await fetch(`${auth_url}/api/users/auth/validate`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.status !== 200) {
      return false;
    }

    if (result) {
      request.body.user = result;

      return true;
    }

    return false;
  }
}
