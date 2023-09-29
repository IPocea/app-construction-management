import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IProjectDataCostsItems } from '../interfaces/data-cost.interface';

export type DataCostDocument = DataCost & Document;

@Schema({ timestamps: true })
export class DataCost {
  @Prop({ required: true })
  projectId: string;
  @Prop({ required: true })
  itemId: string;
  @Prop({ required: true, type: Object })
  data: IProjectDataCostsItems[];
  @Prop()
  createdAt?: Date;
}

export const DataCostSchema = SchemaFactory.createForClass(DataCost);
