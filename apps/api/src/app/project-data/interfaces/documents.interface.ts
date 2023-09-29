export interface IProjectDocumentPagination {
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
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectDocumentsData {
  id?: string;
  userId: string;
  addedBy: IProjectDocumentsAddedByUser;
  name: string;
  mimeType: string;
  path: string;
  createdAt?: string;
}

export interface IProjectDocumentsAddedByUser {
  userFName: string;
  userLName: string;
}
