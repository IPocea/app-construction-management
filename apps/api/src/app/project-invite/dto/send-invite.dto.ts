import { IProject } from '../../project/interfaces/project.interface';

export class SendProjectInviteDto {
  email: string;
  project: IProject;
  roleType?: string;
}
