import {
  Body,
  Controller,
  Post,
  Headers,
  NotFoundException,
  UseGuards,
  Request,
  Get,
  Param,
  NotAcceptableException,
  Delete,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccesTokenGuard } from '../auth/guards/access-token-guard';
import { MailService } from '../mail/mail.service';
import { ProjectService } from '../project/project.service';
import { Project, ProjectDocument } from '../project/schemas/project.schema';
import { IUser } from '../users/interface/user.interface';
import { UsersService } from '../users/users.service';
import { SendProjectInviteDto } from './dto/send-invite.dto';
import { InviteTokenGuard } from './guards/invite-token.guard';
import { ICheckInvitationAndUserResponse } from './interfaces/check-invitation-and-user-response.interface';
import { ProjectInviteService } from './project-invite.service';

@Controller('project-invite')
export class ProjectInviteController {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private projectService: ProjectService,
    private projectInviteService: ProjectInviteService,
    private mailService: MailService,
    private usersService: UsersService
  ) {}

  // receive invite link by email
  @UseGuards(AccesTokenGuard)
  @Post('send-invitation')
  async inviteTokenPassword(
    @Body() sendProjectInviteDto: SendProjectInviteDto,
    @Headers() headers,
    @Request() req
  ): Promise<{ message: string }> {
    if (req.user.email.toLowerCase() === sendProjectInviteDto.email.toLowerCase()) {
      throw new NotAcceptableException(
        'You are not allowed to send the invitation on your own email'
      );
    }
    try {
      const userAndToken =
        await this.projectInviteService.getInviteTokenAndUser(
          sendProjectInviteDto.email,
          sendProjectInviteDto.roleType
        );
      if (!userAndToken) {
        throw new NotFoundException('An unexpected error occurred');
      }
      await this.mailService.sendProjectInvitation(
        userAndToken.user,
        userAndToken.token,
        sendProjectInviteDto.project,
        headers.origin
      );
      return {
        message: `The invitation has been sent to the email address ${userAndToken.user.email}`,
      };
    } catch (error) {
      throw error;
    }
  }

  // check if invite token is valid and send the invited user and project data
  @UseGuards(InviteTokenGuard)
  @Get(':userId/:projectId/check-invitation-and-user')
  async checkInvitationAndUser(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string
  ): Promise<ICheckInvitationAndUserResponse> {
    const user = await this.usersService.findOneNoPass({ _id: userId });
    const project = await this.projectModel.findOne({ _id: projectId });
    return {
      user: user,
      project: project,
    };
  }

  // find temp user
  @UseGuards(InviteTokenGuard)
  @Get(':userId/find-temp-user')
  async findTemporaryUser(@Param('userId') userId: string): Promise<IUser> {
    const user = await this.usersService.findOneNoPass({
      _id: userId,
      isTemporary: true,
    });
    return user;
  }

  @UseGuards(InviteTokenGuard)
  @Delete(':userId/delete-temp-user')
  async deleteTemporaryUser(
    @Param('userId') userId: string
  ): Promise<{ message: string }> {
    const result = await this.projectInviteService.deleteTemporaryUser(userId);
    if (result) return result;
  }

  // add the role to the project with the userId of the new user
  @UseGuards(InviteTokenGuard)
  @Get(':projectId/:roleType/:userId/add-role-to-project')
  async addUserRoleToProject(
    @Param('projectId') projectId: string,
    @Param('roleType') roleType: string,
    @Param('userId') userId: string
  ): Promise<{ message: string }> {
    const result = await this.projectInviteService.addUserIdToProjectRole(
      projectId,
      roleType,
      userId
    );
    return result;
  }

  @UseGuards(InviteTokenGuard)
  @Get(':userId/destroy-invite-token')
  async destroyInviteToken(
    @Param('userId') userId: string
  ): Promise<{ message: string }> {
    const result = await this.projectInviteService.destroyInviteToken(userId);
    return result;
  }

  // add to role if user exists
  @UseGuards(AccesTokenGuard)
  @Get(':projectId/:roleType/:email/add-role-if-user-exists')
  async addRoleIfUserExists(
    @Param('projectId') projectId: string,
    @Param('roleType') roleType: string,
    @Param('email') email: string
  ) {
    return await this.projectService.addToRolesIffUserExists(
      projectId,
      roleType,
      email
    );
  }
}
