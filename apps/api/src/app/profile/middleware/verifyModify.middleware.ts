import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { VerifySignupService } from '../../services/verifySignup.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class VerifyModify implements NestMiddleware {
  constructor(
    private readonly verifySignupService: VerifySignupService,
    private usersServices: UsersService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.usersServices.findOne({ _id: req.params.id });
    this.verifySignupService.checkRole(req.body.role);
    this.verifySignupService.checkEmailPattern(req.body.email);
    if (user.email.toLocaleLowerCase() !== req.body.email.toLocaleLowerCase()) {
      await this.verifySignupService.checkDuplicateEmail(req.body.email);
    }
    next();
  }
}
