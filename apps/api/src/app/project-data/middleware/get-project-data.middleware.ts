import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProjectDataItemIds } from '../enums/project-data.enum';

@Injectable()
export class GetProjectDataMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // to do: to add menuType as param and if is static tu use the below
    // middleware and if is dynamic to find a way to stop if use a unexisting id
    // because on getProjectData if the data does not exist it creeates automaticaly one
    if (!(<any>Object).values(ProjectDataItemIds).includes(+req.params.itemId)) {
      throw new BadRequestException(
        `The item with the id ${+req.params
          .itemId} is not valid. Please chose a valid item`
      );
    }
    next();
  }
}
