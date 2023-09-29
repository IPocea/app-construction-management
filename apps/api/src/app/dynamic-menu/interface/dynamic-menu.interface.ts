import { IDynamicMenuIcon } from './dynamic-menu-icon.interface';

export interface IDynamicNestedMenu {
  _id?: string;
  projectId: string;
  parentId: any;
  depth: number;
  name: string;
  key?: string;
  type?: string;
  description: string;
  icon: IDynamicMenuIcon;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  children: IDynamicNestedMenu[]
}

export interface IDynamicMenu {
  _id?: string;
  projectId: string;
  parentId: any;
  depth: number;
  name: string;
  key?: string;
  type?: string;
  description: string;
  icon: IDynamicMenuIcon;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
