export class CreateProjectDocumentsDto {
  projectId: string;
  itemId: string;
  data: CreateProjectDocumentsDataDto[];
}

export class CreateProjectDocumentsDataDto {
  id: string;
  userId: string;
  name: string;
  mimeType: string;
  path: string;
}
