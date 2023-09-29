import {
  Request,
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  NotFoundException,
  Headers,
  NotAcceptableException,
  Query,
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { InviteTokenGuard } from '../project-invite/guards/invite-token.guard';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AccesTokenGuard } from './guards/access-token-guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ResetTokenGuard } from './guards/reset-token-guard';
import { ILoginResponse } from './interface/login-response.interface';
import { IAuthTokens } from './interface/token.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<ILoginResponse> {
    return this.authService.login(req.user);
  }

  @UseGuards(InviteTokenGuard)
  @Get('login/by-email')
  async loginByEmail(@Request() req, @Query('userId') userId: string) {
    const user = userId
      ? await this.usersService.findOneNoPass({ _id: userId })
      : req.user;
    return this.authService.login(user);
  }

  @UseGuards(AccesTokenGuard)
  @Get('logout')
  async logout(@Request() req): Promise<{ message: string }> {
    return this.authService.logout(req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Request() req): Promise<IAuthTokens> {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }

  // receive reset link by email
  @Post('reset-token-password')
  async resetTokenPassword(
    @Body() email,
    @Headers() headers
  ): Promise<{ message: string }> {
    try {
      const userAndToken = await this.authService.getResetPasswordToken(
        email.email
      );
      if (!userAndToken) {
        throw new NotFoundException(
          `There is no user with the email ${email.email}`
        );
      }
      await this.mailService.sendResetPasswordLink(
        userAndToken.user,
        userAndToken.token,
        headers.origin
      );
      return {
        message:
          'The email with the reset password link was sent. Please check your inbox.',
      };
    } catch (error) {
      throw error;
    }
  }

  // check if a valid reset token was provided
  @UseGuards(ResetTokenGuard)
  @Get('reset-token-password')
  async checkResetToken(@Request() req): Promise<{ message: string }> {
    return { message: 'Access allowed' };
  }

  // change password and destroy reset token
  @UseGuards(ResetTokenGuard)
  @Post('reset-password')
  async resetPassword(
    @Request() req,
    @Body() password
  ): Promise<{ message: string } | number> {
    try {
      const userId = req.user._id;
      const result = await this.authService.changePassword(
        userId,
        password.password
      );
      if (result === 1) {
        throw new NotAcceptableException(
          'The new password cannot be the same as the old password'
        );
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}
