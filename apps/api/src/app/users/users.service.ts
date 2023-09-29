import { BadRequestException, Injectable } from '@nestjs/common';
import { IUser } from './interface/user.interface';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(newUser: CreateUserDto): Promise<IUser> {
    try {
      newUser.password = bcrypt.hashSync(newUser.password, 8);
      const createdUser = new this.userModel(newUser);
      const user = await createdUser.save();
      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        website: user.website,
        role: user.role,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async findAll(): Promise<IUser[]> {
    return this.userModel.find().select('-password');
  }
  async findOne(query: object): Promise<IUser> {
    try {
      const user = await this.userModel.findOne(query);
      return user;
    } catch (error) {
      return null;
    }
  }
  // find an user and return it without password
  async findOneNoPass(query: object): Promise<IUser> {
    try {
      const user = await this.userModel.findOne(query).select('-password -__v -createdAt -updatedAt');
      return user;
    } catch (error) {
      return null;
    }
  }
  async findUserPassword(query: object): Promise<string> {
    try {
      const user = await this.userModel.findOne(query).select('password');
      return user.password;
    } catch (error) {
      return null;
    }
  }
  async update(
    userId: string,
    user: UpdateUserDto
  ): Promise<{ message: string }> {
    try {
      await this.userModel.updateOne({ _id: userId }, user);
      return { message: `The user with id ${userId} was updated` };
    } catch (error) {
      return null;
    }
  }
  async deleteOne(userId: string): Promise<{ message: string }> {
    try {
      await this.userModel.deleteOne({ _id: userId });
      return { message: `The user with id ${userId} was deleted` };
    } catch (error) {
      return null;
    }
  }
}
