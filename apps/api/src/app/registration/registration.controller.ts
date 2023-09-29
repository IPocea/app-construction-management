import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { IUser } from '../users/interface/user.interface';
import { UsersService } from '../users/users.service';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signup(@Body() user: CreateUserDto): Promise<IUser> {
    try {
      return await this.usersService.create(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
