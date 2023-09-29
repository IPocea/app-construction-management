import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (info instanceof jwt.TokenExpiredError) {
      throw new HttpException(
        {
          status: 498,
          error: 'The refresh token has expired',
        },
        498
      );
    }
    if (err || !user) {
      throw new HttpException(
        {
          status: 498,
          error: 'Access Denied',
        },
        498
      );
    }
    return user;
  }
}
