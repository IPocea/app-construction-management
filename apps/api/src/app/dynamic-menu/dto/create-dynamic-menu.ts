import { IDynamicMenuIcon } from '../interface';

export class CreateDynamicMenuDto {
  projectId: string;
  parentId: any;
  depth: number;
  name: string;
  key?: string;
  type: string;
  description?: string;
  icon?: IDynamicMenuIcon;
}
