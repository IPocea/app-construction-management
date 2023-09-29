import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { checkEmptyInputs } from '../../utils/shared-middleware-methods';
import {
  DynamicMenu,
  DynamicMenuDocument,
} from '../schemas/dynamic-menu.schema';

@Injectable()
export class CreateDynamicMenuMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(DynamicMenu.name)
    private dynamicMenuModel: Model<DynamicMenuDocument>
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    checkEmptyInputs(
      req.body.parentId,
      req.body.projectId,
      req.body.depth,
      req.body.name,
      req.body.type
    );
    if (req.body.type !== 'container' && req.body.type !== 'page') {
      throw new BadRequestException(
        'The item type can only be container or page'
      );
    }
    const dynamicMenuItems = await this.dynamicMenuModel
      .find({
        projectId: req.body.projectId,
      })
      .exec();
    const ids = dynamicMenuItems.map((item) => item._id.toString());
    if (!ids.includes(req.body.parentId)) {
      throw new BadRequestException(
        `There is no current id of this project as ${req.body.parentId}`
      );
    }

    next();
  }
}
