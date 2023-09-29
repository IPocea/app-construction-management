import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AccesTokenGuard } from '../auth/guards/access-token-guard';
import { checkIfUserIsAllowedTo } from '../utils';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IProject } from './interfaces/project.interface';
import { ProjectService } from './project.service';
import { Project, ProjectDocument } from './schemas/project.schema';

@Controller('project')
export class ProjectController {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private projectService: ProjectService
  ) {}

  @UseGuards(AccesTokenGuard)
  @Get(':projectId/find-one')
  async findOneProject(
    @Param('projectId') projectId: string
  ): Promise<IProject> {
    if (
      !projectId ||
      typeof projectId !== 'string' ||
      projectId === 'no-project-selected'
    ) {
      throw new BadRequestException('No valid project id was provided');
    }
    const ObjectId = mongoose.Types.ObjectId;
    return await this.projectService.findOne({
      _id: new ObjectId(`${projectId}`),
    });
  }

  @UseGuards(AccesTokenGuard)
  @Get()
  async findAllOfUser(@Request() req): Promise<IProject[]> {
    const userId = req.user._id;
    return await this.projectService.findAllProjectsOfUser(userId);
  }

  @UseGuards(AccesTokenGuard)
  @Post('add')
  async addProject(
    @Body() creatProjectDto: CreateProjectDto,
    @Request() req
  ): Promise<IProject> {
    try {
      return await this.projectService.addProject(
        creatProjectDto,
        req.user._id
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AccesTokenGuard)
  @Patch(':id')
  async updateProject(
    @Param('id') projectId: string,
    @Body() updateProject: UpdateProjectDto,
    @Request() req
  ): Promise<IProject> {
    await checkIfUserIsAllowedTo(this.projectModel, projectId, req.user._id);
    const result = await this.projectService.updateOne(
      projectId,
      updateProject
    );
    if (!result) {
      throw new NotFoundException(
        `Cannot find the project with id ${projectId}`
      );
    }
    return result;
  }

  @UseGuards(AccesTokenGuard)
  @Delete(':id')
  async deleteOne(
    @Param('id') projectId: string,
    @Request() req
  ): Promise<{ message: string }> {
    await checkIfUserIsAllowedTo(this.projectModel, projectId, req.user._id);
    const result = await this.projectService.deleteOne(projectId);
    if (!result) {
      throw new NotFoundException(
        `Could not delete the project with id ${projectId}. Maybe the project does not exist`
      );
    }
    return {
      message: `The project with id ${projectId} was deleted succesfully`,
    };
  }

  // for development purpose
  @Get('find-all')
  async findAll(): Promise<IProject[]> {
    return await this.projectService.findAllProjects();
  }
}
