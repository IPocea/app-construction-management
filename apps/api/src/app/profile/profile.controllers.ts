import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AccesTokenGuard } from '../auth/guards/access-token-guard';
import { IUser } from '../users/interface/user.interface';
import { UsersService } from '../users/users.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly usersServices: UsersService) {}

  // Protected routes
  @UseGuards(AccesTokenGuard)
  @Get()
  async getProfile(@Request() req): Promise<IUser> {
    return await this.usersServices.findOneNoPass({_id: req.user._id});
  }

  @UseGuards(AccesTokenGuard)
  @Patch()
  async updateOne(@Request() req, @Body() body): Promise<{ message: string }> {
    if (body.hasOwnProperty('password')) throw new ForbiddenException();
    const userId = req.user._id;
    const result = await this.usersServices.update(userId, body);
    if (!result) {
      throw new NotFoundException(`Cannot find user with id ${userId}`);
    }
    return result;
  }

  @UseGuards(AccesTokenGuard)
  @Delete()
  async deleteOne(@Request() req): Promise<{ message: string }> {
    const userId = req.user._id;
    const num = await this.usersServices.deleteOne(userId);
    if (!num) {
      throw new NotFoundException(
        `Could not delete the user with id ${userId}. Maybe the user does not exist`
      );
    }
    return { message: `The user with id ${userId} was deleted succesfully` };
  }
}
