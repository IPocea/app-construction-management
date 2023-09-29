import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { checkEmptyInputs } from '../../utils/shared-middleware-methods';

@Injectable()
export class CreateProjectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    checkEmptyInputs(req.body.name, req.body.city, req.body.area);

    next();
  }
}
