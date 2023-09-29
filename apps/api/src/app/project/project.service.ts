import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DynamicMenuService } from '../dynamic-menu/dynamic-menu.service';
import { IUser } from '../users/interface/user.interface';
import { UsersService } from '../users/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRolesEnum } from './enums/project-roles.enum';
import { IProject } from './interfaces/project.interface';
import { Project, ProjectDocument } from './schemas/project.schema';
@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private dynamicMenuService: DynamicMenuService,
    private usersService: UsersService
  ) {}

  async findAllProjects(): Promise<IProject[]> {
    return await this.projectModel.find().exec();
  }

  async findAllProjectsOfUser(userId: string): Promise<IProject[]> {
    const userIdToString: string = userId.toString();
    return await this.projectModel
      .find({
        $or: [
          {
            'roles.admin': userIdToString,
          },
          {
            'roles.editor': userIdToString,
          },
          {
            'roles.viewer': userIdToString,
          },
        ],
      })
      .exec();
  }

  async addProject(
    creatProjectDto: CreateProjectDto,
    userId: string
  ): Promise<IProject> {
    const duplicate = await this.findOne({
      name: {
        $regex: new RegExp('^' + creatProjectDto.name + '$', 'i'),
      },
    });
    if (duplicate) {
      throw new BadRequestException(
        `The project with the name ${creatProjectDto.name} already exists!`
      );
    }
    const userIdToString = userId.toString();
    const newProject: IProject = {
      ...creatProjectDto,
      roles: {
        admin: userIdToString,
        editor: [],
        viewer: [],
      },
    };
    const savedProject = await new this.projectModel(newProject).save();
    this.dynamicMenuService.createRootAndDashboard(savedProject._id.toString());
    return savedProject;
  }

  async findOne(query: object): Promise<IProject> {
    try {
      const project = await this.projectModel.findOne(query);
      return project;
    } catch (error) {
      return null;
    }
  }

  async updateOne(
    projectId: string,
    updateProject: UpdateProjectDto
  ): Promise<IProject> {
    try {
      const updatedProject = await this.projectModel.findOneAndUpdate(
        { _id: projectId },
        updateProject,
        { new: true }
      );
      return updatedProject;
    } catch (error) {
      return null;
    }
  }

  async deleteOne(projectId: string): Promise<{ message: string }> {
    try {
      await this.projectModel.deleteOne({ _id: projectId });
      return { message: `The user with id ${projectId} was deleted` };
    } catch (error) {
      return null;
    }
  }

  // if user exists add userId the to the selected role
  async addToRolesIffUserExists(
    projectId: string,
    roleType: string,
    email: string
  ): Promise<IUser> {
    const user = await this.usersService.findOne({
      email: {
        $regex: new RegExp('^' + email.toLowerCase() + '$', 'i'),
      },
      isTemporary: {
        $exists: false,
      },
    });
    if (user) {
      await this.addToRoles(projectId, roleType, user._id);
    }
    return user;
  }

  // adds userId only to editor and viewer array of the project.roles
  async addToRoles(
    projectId: string,
    roleType: string,
    userId: string
  ): Promise<IProject> {
    await this.checkIfUserHasAlreadyTheRole(projectId, roleType, userId.toString());
    const updatedProject: IProject = await this.projectModel.findOneAndUpdate(
      { _id: projectId },
      { $push: { [`roles.${roleType}`]: userId.toString() } },
      { returnOriginal: false }
    );
    return updatedProject;
  }

  async deleteFromRoles(
    projectId: string,
    roleType: string,
    userId: string
  ): Promise<IProject> {
    this.checkRole(roleType);
    const updatedProject: IProject = await this.projectModel.findOneAndUpdate(
      { _id: projectId },
      { $pull: { [`roles.${roleType}`]: { userId: userId.toString() } } },
      { returnOriginal: false }
    );
    return updatedProject;
  }

  async checkIfUserHasAlreadyTheRole(
    projectId: string,
    roleType: string,
    userId: string
  ): Promise<void> {
    this.checkRole(roleType);
    const project = await this.projectModel.findOne({ _id: projectId });
    if (project.roles[`${roleType}`].includes(userId.toString())) {
      throw new BadRequestException(
        `The selected user is already added as ${roleType}`
      );
    }
  }

  checkRole(roleType: string): void {
    if (
      roleType !== ProjectRolesEnum.EDITOR &&
      roleType !== ProjectRolesEnum.VIEWER
    ) {
      throw new BadRequestException(`There is no role as ${roleType}`);
    }
  }
}
