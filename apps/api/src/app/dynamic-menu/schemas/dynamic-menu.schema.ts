import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IDynamicMenuIcon } from '../interface';

export type DynamicMenuDocument = DynamicMenu & Document;

@Schema({ timestamps: true })
export class DynamicMenu {
  @Prop({required: true})
  projectId: string;
  @Prop()
  parentId: Types.ObjectId;
  @Prop({required: true})
  depth: number;
  @Prop({ required: true })
  name: string;
  @Prop()
  key: string;
  @Prop({ required: true })
  type: string;
  @Prop()
  description: string;
  @Prop({ type: Object })
  icon: IDynamicMenuIcon;
  @Prop()
  createdAt?: Date;
}

export const DynamicMenuSchema = SchemaFactory.createForClass(DynamicMenu);
