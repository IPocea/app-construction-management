import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { IUser } from './interface/user.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<IUser[]> {
    return await this.usersService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') userId: string): Promise<IUser> {
    const user = await this.usersService.findOneNoPass({ _id: userId });
    if (!user) {
      throw new NotFoundException(`Could not find the user with id ${userId}`);
    }
    return user;
  }
}
