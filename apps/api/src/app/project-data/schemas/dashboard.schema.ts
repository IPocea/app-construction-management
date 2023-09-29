import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IProjectDashboardData } from '../interfaces/dashboard.interface';

export type DashboardDocument = Dashboard & Document;

@Schema({ timestamps: true })
export class Dashboard {
  @Prop({ required: true })
  projectId: string;
  @Prop({ required: true })
  itemId: string;
  @Prop({ required: true, type: Object })
  data: IProjectDashboardData;
  @Prop()
  createdAt?: Date;
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
