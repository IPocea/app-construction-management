import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { VerifySignupService } from '../../services/verifySignup.service';

@Injectable()
export class VerifySignup implements NestMiddleware {
  constructor(private readonly verifySignupService: VerifySignupService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.verifySignupService.checkEmptyInputs(
      req.body.firstName,
      req.body.lastName,
      req.body.password,
      req.body.email
    );
    if (!req.body.role) {
      req.body.role = this.verifySignupService.checkRole(req.body.role);
    }
    this.verifySignupService.checkPasswordPattern(req.body.password);
    this.verifySignupService.checkEmailPattern(req.body.email);
    await this.verifySignupService.checkDuplicateEmail(req.body.email);

    next();
  }
}
