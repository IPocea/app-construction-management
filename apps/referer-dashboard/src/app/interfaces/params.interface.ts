export interface IDashboardRightSideParams {
  category: string;
  subcategory: string;
  subcategoryTwo?: string;
}

export interface IProjectDetailsParams {
  menuType?: string;
  projectId?: string;
  itemId?: string;
  tabType?: string;
}

export interface IProjectDetailsFilters {
  pageIndex: string;
  pageSize: string;
  sortBy?: string;
  searchValue?: string;
  sortDirection?: string;
}

export interface IInvitationParams {
  userId: string;
  token: string;
  projectId: string;
}
