export interface IProject {
  _id?: string;
  name: string;
  city: string;
  area: string;
  roles: IProjectRoles;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectRoles {
  admin: string;
  editor: string[];
  viewer: string[];
}