import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { checkEmptyInputs } from '../../utils/shared-middleware-methods';
import { ProjectService } from '../project.service';

@Injectable()
export class UpdateProjectMiddleware implements NestMiddleware {
  constructor(private projectService: ProjectService){}

  async use(req: Request, res: Response, next: NextFunction) {
    checkEmptyInputs(req.body.name, req.body.city, req.body.area);
    const projectId = await this.projectService.findOne({_id: req.params.id})
    if(projectId.name.toLowerCase() !== req.body.name.toLowerCase()){
      const project = await this.projectService.findOne({
        name: {
          $regex: new RegExp('^' + req.body.name + '$', 'i'),
        },
      });
      if (project) {
        throw new BadRequestException('The name is already in use!');
      }
    }
    next();
  }
}