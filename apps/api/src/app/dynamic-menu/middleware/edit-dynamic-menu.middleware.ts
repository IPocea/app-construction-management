import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { checkEmptyInputs } from '../../utils/shared-middleware-methods';

@Injectable()
export class EditDynamicMenuMiddleware implements NestMiddleware {
  constructor() {}
  use(req: Request, res: Response, next: NextFunction) {
    // to do: make this code as a function in utils/shared-middleware-methods
    // as checkEmptyInputs
    if (
      req.body.hasOwnProperty('projectId') ||
      req.body.hasOwnProperty('parentId') ||
      req.body.hasOwnProperty('depth') ||
      req.body.hasOwnProperty('createdAt') ||
      req.body.hasOwnProperty('updatedAt') ||
      req.body.hasOwnProperty('__v')
    ) {
      throw new ForbiddenException(
        'You are not allowed to change these values'
      );
    }
    checkEmptyInputs(req.body.name);
    next();
  }
}
