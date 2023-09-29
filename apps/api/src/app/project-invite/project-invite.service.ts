import { Injectable } from '@nestjs/common';
import { IPayload } from '../auth/interface/payload.interface';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { jwtConstants } from '../auth/constants';
import { generateRandomText } from './utils/generate-random-text';
import { ProjectService } from '../project/project.service';

@Injectable()
export class ProjectInviteService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private projectService: ProjectService
  ) {}

  // validate invite token

  async validateInviteToken(payload: IPayload): Promise<string> {
    const inviteToken = (
      await this.tokenService.findOne({ userId: payload.sub })
    )?.inviteToken;
    if (!inviteToken) {
      return null;
    }
    return inviteToken;
  }

  // get invite token and user
  async getInviteTokenAndUser(email: string, roleType: string) {
    let user = await this.usersService.findOne({
      email: {
        $regex: new RegExp('^' + email.toLowerCase() + '$', 'i'),
      },
    });
    if (!user) {
      const password = this.hashData(generateRandomText(80));
      user = await this.usersService.create({
        firstName: 'Temp',
        lastName: 'User',
        password: password,
        email: email,
        role: 'user',
        isTemporary: true,
        roleType: roleType,
      });
    }
    const token = await this.getInviteToken(user._id, user.email);
    const isTokenInDatabase = await this.tokenService.findOne({
      userId: user._id,
    });
    if (!isTokenInDatabase) {
      await this.tokenService.create({
        userId: user._id,
        inviteToken: token,
      });
    } else {
      await this.updateInviteToken(user._id, token);
    }
    return {
      user: user,
      token: token,
    };
  }

  // update only invite token
  async updateInviteToken(userId: string, inviteToken: string): Promise<void> {
    const hashedInviteToken = this.hashData(inviteToken);
    await this.tokenService.update(userId, hashedInviteToken, 'invite');
  }

  // destroys the invite token
  async destroyInviteToken(userId: string): Promise<{
    message: string;
  }> {
    await this.tokenService.update(userId, null, 'invite');
    return {
      message: 'The invite token has been destroyed',
    };
  }

  async deleteTemporaryUser(userId: string): Promise<{ message: string }> {
    const result = await this.usersService.deleteOne(userId);
    if (result) return result;
  }

  hashData(data: string, salt: number = 8): string {
    return bcrypt.hashSync(data, salt);
  }

  // generate the invite token
  async getInviteToken(userId: string, email: string): Promise<string> {
    const inviteToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: jwtConstants.inviteTokenSecret,
        expiresIn: `${jwtConstants.inviteTokenExpirationTime}`,
      }
    );
    return inviteToken;
  }

  // add userId to the project role
  async addUserIdToProjectRole(
    projectId: string,
    roleType: string,
    userId: string
  ): Promise<{ message: string }> {
    const result = await this.projectService.addToRoles(
      projectId,
      roleType,
      userId
    );
    if (result) {
      return {
        message: `The role ${roleType} has been added to the project`,
      };
    }
  }
}
