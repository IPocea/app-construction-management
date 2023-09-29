import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccesTokenGuard } from '../auth/guards/access-token-guard';
import { CreateMenuDto } from './dto/create-menu.dto';
import { IMenu } from './interface/menu.interface';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @UseGuards(AccesTokenGuard)
  @Get()
  async findAll(): Promise<IMenu[]> {
    const menus = await this.menuService.findAll();
    if (menus) {
      return menus;
    }
  }

  @Post()
  async create(@Body() menuDto: CreateMenuDto): Promise<IMenu> {
    try {
      return await this.menuService.createMenu(menuDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
