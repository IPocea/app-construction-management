export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  website?: string;
  role?: string;
  isTemporary?: boolean; // necesary when we make a temp user
  roleType: string; // necesary when we make a temp user
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUserLoginData {
  username: string;
  password: string;
}
export interface IUserTestModel {
  id?: number;
  name: string;
  username: string;
  email: string;
}
