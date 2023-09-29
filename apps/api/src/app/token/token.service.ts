import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from '../token/schemas/token.schema';
import { Model } from 'mongoose';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { ITokens } from './interface/tokens.interface';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>
  ) {}

  async create(newRefreshToken: CreateRefreshTokenDto): Promise<ITokens> {
    try {
      const createdRefreshToken = new this.tokenModel(newRefreshToken);
      return await createdRefreshToken.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    userId: string,
    token: string | null,
    tokenType: string
  ): Promise<ITokens> {
    try {
      switch (tokenType) {
        case 'refresh':
          return await this.tokenModel
            .findOneAndUpdate(
              { userId: userId },
              { refreshToken: token },
              { new: true }
            )
            .exec();
        case 'reset':
          return await this.tokenModel
            .findOneAndUpdate(
              { userId: userId },
              { resetPasswordToken: token },
              { new: true }
            )
            .exec();
        case 'invite':
          return await this.tokenModel
            .findOneAndUpdate(
              { userId: userId },
              { inviteToken: token },
              { new: true }
            )
            .exec();
        default:
          break;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(query: object): Promise<ITokens> {
    try {
      const token = await this.tokenModel.findOne(query);
      return token;
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<ITokens[]> {
    try {
      const tokens = await this.tokenModel.find().exec();
      return tokens;
    } catch (error) {
      return null;
    }
  }
}
