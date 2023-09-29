import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.body.username) {
      throw new BadRequestException('The email cannot be empty!');
    }
    if (!req.body.password) {
      throw new BadRequestException('The password cannot be empty!');
    }
    next();
  }
}
