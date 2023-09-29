import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IProjectDocumentsData } from '../interfaces/documents.interface';

export type ProjectDocumentDocument = ProjectDocument & Document;

@Schema({ timestamps: true })
export class ProjectDocument {
  @Prop({ required: true })
  projectId: string;
  @Prop({ required: true })
  itemId: string;
  @Prop({ required: true, type: Object })
  data: IProjectDocumentsData[];
  @Prop()
  createdAt?: Date;
}

export const ProjectDocumentSchema =
  SchemaFactory.createForClass(ProjectDocument);
