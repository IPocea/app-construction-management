import { IProject } from '../../project/interfaces/project.interface';
import { IUser } from '../../users/interface/user.interface';

export interface ICheckInvitationAndUserResponse {
  user: IUser;
  project: IProject;
}
