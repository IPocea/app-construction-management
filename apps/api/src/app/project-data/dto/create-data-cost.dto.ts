export class CreateProjectDataCostsDto {
  projectId: string;
  itemId: string;
  data: CreateProjectDataCostsItemDto[];
}

export class CreateProjectDataCostsItemDto {
  name: string;
  measurementUnit: string;
  quantity: number;
  unitPrice: number;
  mentiones: string;
}
