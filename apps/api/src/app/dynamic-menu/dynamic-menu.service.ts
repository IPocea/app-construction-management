import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateDynamicMenuDto } from './dto/create-dynamic-menu';
import { EditDynamicMenuDto } from './dto/edit-dynamic-menu.dto';
import { IDynamicMenu, IDynamicNestedMenu } from './interface';
import {
  DynamicMenu,
  DynamicMenuDocument,
} from './schemas/dynamic-menu.schema';
import { buildNestedMenu } from './utils/build-nested-menu';

@Injectable()
export class DynamicMenuService {
  constructor(
    @InjectModel(DynamicMenu.name)
    private dynamicMenuModel: Model<DynamicMenuDocument>
  ) {}

  async createRootAndDashboard(projectId: string) {
    try {
      const root = await this.createMenu({
        projectId: projectId,
        parentId: null,
        depth: 0,
        type: 'root',
        name: 'root',
      });
      await this.createMenu({
        projectId: projectId,
        parentId: root._id,
        depth: 1,
        type: 'undeletable',
        name: 'Dashboard',
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createMenu(newMenu: CreateDynamicMenuDto): Promise<IDynamicMenu> {
    try {
      const ObjectId = mongoose.Types.ObjectId;
      if (newMenu.parentId) {
        newMenu.parentId = new ObjectId(`${newMenu.parentId}`);
      }
      const createdMenu = new this.dynamicMenuModel(newMenu);
      return await createdMenu.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async editMenu(
    menuId: string,
    editDynamicMenuDto: EditDynamicMenuDto
  ): Promise<IDynamicMenu> {
    try {
      return await this.dynamicMenuModel.findOneAndUpdate(
        { _id: menuId },
        editDynamicMenuDto,
        { new: true }
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findProjectIdAndDeleteTask(menuId: string): Promise<string> {
    try {
      const ObjectId = mongoose.Types.ObjectId;
      const projectId = (await this.dynamicMenuModel.findOne({ _id: menuId }))
        ?.projectId;
      await this.dynamicMenuModel.deleteOne({ _id: new ObjectId(`${menuId}`) });
      return projectId;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findProjectIdAndDeleteCategory(menuId: string) {
    try {
      const ObjectId = mongoose.Types.ObjectId;
      const projectId = (await this.dynamicMenuModel.findOne({ _id: menuId }))
        ?.projectId;
      const childrenIds = (
        await this.dynamicMenuModel.aggregate([
          {
            $match: {
              _id: new ObjectId(`${menuId}`),
            },
          },
          {
            $graphLookup: {
              from: 'dynamicmenus',
              startWith: '$_id',
              connectFromField: '_id',
              connectToField: 'parentId',
              as: 'ids',
            },
          },
          {
            $project: {
              _id: 0,
              'ids._id': 1,
            },
          },
          {
            $set: {
              ids: '$ids._id',
            },
          },
        ])
      )[0]?.ids;
      childrenIds.push(new ObjectId(`${menuId}`));
      await this.dynamicMenuModel.deleteMany({ _id: { $in: childrenIds } });
      return projectId;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async findAndBuildNestedMenu(projectId: string): Promise<IDynamicNestedMenu> {
    try {
      const dynamicMenuItems = await this.dynamicMenuModel
        .find({
          projectId: projectId,
        })
        .exec();
      const dynamicNetedMenu = buildNestedMenu(dynamicMenuItems);
      return dynamicNetedMenu ? dynamicNetedMenu : null;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findSingleMenuItem(menuId: string): Promise<IDynamicMenu> {
    try {
      const item = await this.dynamicMenuModel.findOne({
        _id: menuId,
      });
      return item;
    } catch (error) {}
  }
}
