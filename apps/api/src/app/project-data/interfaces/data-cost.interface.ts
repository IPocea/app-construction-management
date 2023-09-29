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
  data: IProjectDataCostsItems[];
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDataCostsItems {
  id?: string;
  name: string;
  measurementUnit: string;
  quantity: number;
  unitPrice: number;
  mentiones: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProjectDataCostsQueryParams {
  pageIndex: string;
  pageSize: string;
  sortBy?: string;
  searchValue?: string;
  sortDirection?: string;
}