import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IProject } from '../project/interfaces/project.interface';
import { IUser } from '../users/interface/user.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPasswordLink(
    user: IUser,
    token: string,
    origin: string
  ): Promise<void> {
    const url = `${origin}/reset-password?email=${user.email}&token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your Refer-me password',
      template: './change-password', // `.hbs` extension is appended automatically
      context: {
        // filling curly brackets with content
        name: user.firstName,
        url: url,
      },
    });
  }

  async sendProjectInvitation(
    user: IUser,
    token: string,
    project: IProject,
    origin: string
  ): Promise<void> {
    const url = `${origin}/project-invitation?userId=${user._id}&token=${token}&projectId=${project._id}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Invitatie la proiectul ${project.name} // Invite to the project ${project.name}`,
      template: user?.isTemporary
        ? './invite-temporary-user-to-project'
        : './invite-existing-user-to-project',
      context: {
        // filling curly brackets with content
        name: user?.isTemporary ? 'Guest' : user.firstName,
        nameInEnglish: user?.isTemporary ? 'Oaspete' : user.firstName,
        projectName: project.name,
        url: url,
      },
    });
  }
}
