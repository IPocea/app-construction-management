import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token {
  @Prop({ required: true })
  userId: string;
  @Prop()
  refreshToken: string | null;
  @Prop()
  resetPasswordToken: string | null;
  @Prop()
  inviteToken?: string;
  @Prop()
  createdAt?: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
