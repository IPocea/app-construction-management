import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccesTokenGuard } from '../auth/guards/access-token-guard';
import { CreateDynamicMenuDto } from './dto/create-dynamic-menu';
import { EditDynamicMenuDto } from './dto/edit-dynamic-menu.dto';
import { IDynamicMenu, IDynamicNestedMenu } from './interface';
import { DynamicMenuService } from './dynamic-menu.service';
import { checkIfUserIsAllowedTo } from '../utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../project/schemas/project.schema';

@Controller('dynamic-menu')
export class DynamicMenuController {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private dynamicMenuService: DynamicMenuService
  ) {}

  @UseGuards(AccesTokenGuard)
  @Get(':id/find-one')
  async getSingleMenuItem(@Param('id') menuId: string): Promise<IDynamicMenu> {
    try {
      const item = await this.dynamicMenuService.findSingleMenuItem(menuId);
      return item;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AccesTokenGuard)
  @Get(':projectId')
  async findOneNestedMenu(
    @Param('projectId') projectId: string
  ): Promise<IDynamicNestedMenu> {
    try {
      const result = await this.dynamicMenuService.findAndBuildNestedMenu(
        projectId
      );
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AccesTokenGuard)
  @Post(':projectId/add')
  async create(
    @Param('projectId') projectId: string,
    @Body() dynamicMenuDto: CreateDynamicMenuDto,
    @Request() req
  ): Promise<IDynamicNestedMenu> {
    await checkIfUserIsAllowedTo(this.projectModel, projectId, req.user._id);
    try {
      await this.dynamicMenuService.createMenu(dynamicMenuDto);
      const result = await this.dynamicMenuService.findAndBuildNestedMenu(
        projectId
      );
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AccesTokenGuard)
  @Patch(':id/edit')
  async edit(
    @Param('id') menuId: string,
    @Body() editDynamicMenuDto: EditDynamicMenuDto,
    @Request() req
  ): Promise<IDynamicNestedMenu> {
    const projectId = (await this.dynamicMenuService.findSingleMenuItem(menuId))
      ?.projectId;
    await checkIfUserIsAllowedTo(this.projectModel, projectId, req.user._id);
    try {
      const modifiedMenu = await this.dynamicMenuService.editMenu(
        menuId,
        editDynamicMenuDto
      );
      const result = await this.dynamicMenuService.findAndBuildNestedMenu(
        modifiedMenu.projectId
      );
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AccesTokenGuard)
  @Delete(':id/delete-task')
  async deleteTask(
    @Param('id') menuId: string,
    @Request() req
  ): Promise<IDynamicNestedMenu> {
    const projId = (await this.dynamicMenuService.findSingleMenuItem(menuId))
      ?.projectId;
    await checkIfUserIsAllowedTo(this.projectModel, projId, req.user._id);
    try {
      const projectId =
        await this.dynamicMenuService.findProjectIdAndDeleteTask(menuId);
      if (projectId) {
        const result = await this.dynamicMenuService.findAndBuildNestedMenu(
          projectId
        );
        return result;
      } else {
        throw new BadRequestException(`There is no item with the id ${menuId}`);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AccesTokenGuard)
  @Delete(':id/delete-category')
  async deleteCategory(
    @Param('id') menuId: string,
    @Request() req
  ): Promise<IDynamicNestedMenu> {
    const projId = (await this.dynamicMenuService.findSingleMenuItem(menuId))
      ?.projectId;
    await checkIfUserIsAllowedTo(this.projectModel, projId, req.user._id);
    try {
      const projectId =
        await this.dynamicMenuService.findProjectIdAndDeleteCategory(menuId);
      if (projectId) {
        const result = await this.dynamicMenuService.findAndBuildNestedMenu(
          projectId
        );
        return result;
      } else {
        throw new BadRequestException(`There is no item with the id ${menuId}`);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
