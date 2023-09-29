import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IIcon } from '../interface/icon.interface';

export type MenuDocument = Menu & Document;

@Schema()
export class Menu {
  @Prop({ required: true, unique: true })
  id: number;
  @Prop({ required: true, unique: true })
  name: string;
  @Prop({ required: true })
  key: string;
  @Prop({ required: true })
  type: string;
  @Prop()
  description: string;
  @Prop({ type: Object })
  icon: IIcon;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
