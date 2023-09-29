export class CreateProjectDashboardDto {
  projectId: string;
  itemId: string;
  data: CreateProjectDashboardDataDto;
}

export class CreateProjectDashboardDataDto {
  progress: number;
  details: CreateProjectDashboardDetailsDto[];
}

export class CreateProjectDashboardDetailsDto {
  title: string;
  labels: string[];
  dataset: number[];
}
