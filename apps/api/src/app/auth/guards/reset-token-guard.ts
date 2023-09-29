import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ResetTokenGuard extends AuthGuard('jwt-reset') {
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (info instanceof jwt.TokenExpiredError) {
      throw new ForbiddenException('The reset token has expired');
    }
    if (err || !user) {
      throw err || new UnauthorizedException('Access Denied');
    }
    return user;
  }
}
