import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IProjectDataCostsItem,
  IProjectDetailsFilters,
  IProjectDetailsParams,
} from '@interfaces';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { setFullAvailableFilters, setPageSize } from '@utils/mat-table';

@Injectable({
  providedIn: 'root',
})
export class ProjectDetailsService {
  constructor(private http: HttpClient) {}

  getProjectDetails(
    params: IProjectDetailsParams,
    filters: IProjectDetailsFilters //filters
  ): Observable<any> {
    const filtersString =
      filters && filters?.pageIndex && filters?.pageSize
        ? setFullAvailableFilters(filters)
        : '';
    return this.http.get<any>(
      environment.baseUrl +
        `project-details/${params.projectId}/${params.itemId}/${params.tabType}${filtersString}`
    );
  }

  addProjectItem(
    dataCostsDocumentId: string,
    filters: IProjectDetailsFilters,
    projectItem: IProjectDataCostsItem
  ): Observable<any> {
    const pageSizeQuery = setPageSize(filters);
    return this.http.post<any>(
      environment.baseUrl +
        `project-details/data-costs-data/${dataCostsDocumentId}/add${pageSizeQuery}`,
      projectItem
    );
  }

  editProjectItem(
    dataCostsDocumentId: string,
    dataItemId: string,
    filters: IProjectDetailsFilters,
    projectItem: IProjectDataCostsItem
  ): Observable<any> {
    const filtersString = filters ? setFullAvailableFilters(filters) : '';
    return this.http.patch<any>(
      environment.baseUrl +
        `project-details/data-costs-data/${dataCostsDocumentId}/${dataItemId}/edit${filtersString}`,
      projectItem
    );
  }

  deleteProjectItem(
    documentId: string,
    dataItemId: string,
    filters: IProjectDetailsFilters
  ): Observable<any> {
    const filtersString = setFullAvailableFilters(filters);
    return this.http.delete<any>(
      environment.baseUrl +
        `project-details/data-costs-data/${documentId}/${dataItemId}/delete${filtersString}`
    );
  }
}
