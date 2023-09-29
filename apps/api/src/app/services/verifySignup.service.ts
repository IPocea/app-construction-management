import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

// This services are used in verifySignup and verifyModify middlewares
@Injectable()
export class VerifySignupService {
  ROLES: string[] = ['User', 'Editor', 'Admin'];
  emailPattern = /[a-z0-9\-_.0]+@[a-z0-9\-_.]+\.[a-z]{2,}/i;
  passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&^()])[A-Za-z\d@#$!%*?&^()]{8,}$/;

  constructor(private readonly userService: UsersService) {}

  checkEmptyInputs(...args: string[]): void {
    for (const arg of args) {
      if (!arg) {
        throw new BadRequestException('Please complete all mandatory inputs!');
      }
    }
  }

  // Check role and if not found then set as user
  checkRole(role: string): string {
    if (!role) {
      return (role = 'User');
    } else if (!this.ROLES.includes(role)) {
      throw new BadRequestException(`The role ${role} does not exist!`);
    }
  }

  checkPasswordPattern(password: string): void {
    if (!this.passwordPattern.test(password)) {
      throw new BadRequestException(
        'The password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.'
      );
    }
  }

  checkEmailPattern(email: string): void {
    if (!this.emailPattern.test(email)) {
      throw new BadRequestException('Invalid email format!');
    }
  }

  async checkDuplicateEmail(email: string): Promise<void> {
    const user = await this.userService.findOne({
      email: {
        $regex: new RegExp('^' + email.toLowerCase() + '$', 'i'),
      },
      isTemporary: {
        $exists: false,
      },
    });
    if (user) {
      throw new BadRequestException('The email is already in use!');
    }
  }
}
