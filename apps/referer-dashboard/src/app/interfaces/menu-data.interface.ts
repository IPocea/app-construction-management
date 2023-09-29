export interface IMenuData {
  _id?: string;
  id: number | string;
  name: string;
  key: string;
  type: string;
  description?: string;
  icon?: IMenuDataIcon;
  depth?: number;
  projectId?: string;
  parentId?: string;
  children?: IMenuData[];
}

export interface IMenuDataIcon {
  type: string;
  content: string;
}

export interface IDynamicNestedMenu {
  _id?: string;
  projectId: string;
  parentId: string;
  depth: number;
  name: string;
  key?: string;
  type: string;
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
  parentId: string;
  depth: number;
  name: string;
  key?: string;
  type: string;
  description?: string;
  icon?: IDynamicMenuIcon;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface IDynamicMenuIcon {
  type: string;
  content: string;
}

export interface IDynamicMenuEditBody {
  name: string;
  key?: string;
  description?: string;
  icon?: IDynamicMenuIcon;
}