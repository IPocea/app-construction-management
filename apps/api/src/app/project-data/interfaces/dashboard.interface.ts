export interface IProjectDashboard {
  _id?: string;
  projectId: string;
  itemId: string;
  data: IProjectDashboardData;
  __v?: number;
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
