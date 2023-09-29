import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IProjectRoles } from '../interfaces/project.interface';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })

export class Project {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  area: string;
  @Prop({ required: true, type: Object })
  roles: IProjectRoles;
  @Prop()
  createdAt?: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);