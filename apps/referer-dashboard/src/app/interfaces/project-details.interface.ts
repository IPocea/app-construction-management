import { IUser } from "@interfaces";

export interface IProjectDashboard {
  _id?: string;
  projectId: string;
  itemId: string;
  data: IProjectDashboardData;
  __V?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDashboardData {
  progress: number;
  details: IProjectDashboardDetails[];
}

export interface IProjectDashboardDetails {
  title: string;
  labels: string[];
  dataset: number[];
}

export interface IProjectDataCostsPagination {
  dataCosts: IProjectDataCosts;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
}

export interface IProjectDataCosts {
  _id?: string;
  projectId: string;
  itemId: string;
  data: IProjectDataCostsItem[];
  __V?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDataCostsItem {
  id?: string;
  name: string;
  measurementUnit: string;
  quantity: number;
  unitPrice: number;
  value: number;
  createdAt?: string;
  updatedAt?: string;
  mentiones: string;
}

export interface IProjectDocumentsPagination {
  documents: IProjectDocuments;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
}

export interface IProjectDocuments {
  _id?: string;
  projectId: string;
  itemId: string;
  data: IProjectDocumentsData[];
  __V?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDocumentsData {
  id: string;
  userId: string;
  addedBy: IProjectAddedBy;
  name: string;
  mimeType: string;
  path: string;
  createdAt: Date;
}

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

export interface IProjectAddedBy {
  userFName: string;
  userLName: string;
}

export interface ICheckInvitationAndUserResponse {
  user: IUser;
  project: IProject;
}

export interface ISendProjectInviteData {
  email: string;
  project: IProject;
  roleType?: string;
}
