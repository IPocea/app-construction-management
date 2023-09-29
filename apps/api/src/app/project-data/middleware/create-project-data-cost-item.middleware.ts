import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { checkEmptyInputs } from '../../utils/shared-middleware-methods';

@Injectable()
export class CreateProjectDataCostsItemMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    checkEmptyInputs(
      req.body.name,
      req.body.measurementUnit,
      req.body.quantity,
      req.body.unitPrice
    );
    next();
  }
}
