import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMenuDto } from './dto/create-menu.dto';
import { IMenu } from './interface/menu.interface';
import { Menu, MenuDocument } from './schemas/menu.schema';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  async createMenu(newMenu: CreateMenuDto): Promise<IMenu> {
    try {
      const createdMenu = new this.menuModel(newMenu);
      return await createdMenu.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<IMenu[]> {
    try {
      const menus = await this.menuModel.find().sort({ id: 1 }).exec();
      return menus;
    } catch (error) {
      return null;
    }
  }
}
