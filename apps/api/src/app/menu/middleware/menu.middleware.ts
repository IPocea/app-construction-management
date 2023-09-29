import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MenuMiddleware implements NestMiddleware {
  constructor() {}
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.body.name || !req.body.key || !req.body.type) {
      throw new BadRequestException('Inputs cannot be empty!');
    }
    next();
  }
}
