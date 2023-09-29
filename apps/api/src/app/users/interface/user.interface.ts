export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  website?: string;
  role: string;
  isTemporary?: boolean;
  roleType?: string;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUserLoginData {
  email: string;
  password: string;
}
