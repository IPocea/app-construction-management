import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  website: string;

  @Prop()
  isTemporary?: boolean;

  @Prop()
  roleType?: string;

  @Prop()
  createdAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
