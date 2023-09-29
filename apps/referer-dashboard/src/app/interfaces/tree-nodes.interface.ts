export interface ITreeNode {
  id?: number | string;
  _id?: string;
  name: string;
  type: string
  depth?: number;
  parentId?: string;
  projectId?: string;
  children?: ITreeNode[];
}

export interface TreeFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

export interface INode {
  expandable: boolean;
  name: string;
  level: number;
  id: number | string;
  type: string
  depth?: number;
  parentId?: string;
  projectId?: string;
}
