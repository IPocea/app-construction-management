import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IProjectDetailsFilters,
  IProjectDocumentsPagination,
} from '@interfaces';
import { setFullAvailableFilters } from '@utils/mat-table';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectUploadDocumentsService {
  constructor(private http: HttpClient) {}

  uploadFiles(
    formData: any,
    fullDocumentId: string
  ): Observable<IProjectDocumentsPagination> {
    return this.http.post<IProjectDocumentsPagination>(
      environment.projectDocumebtsBaseUrl + `${fullDocumentId}/upload`,
      formData
    );
  }

  getImgBlob(fullDocumentId: string, dataItemId: string): Observable<any> {
    return this.http.get<any>(
      environment.projectDocumebtsBaseUrl +
        `${fullDocumentId}/${dataItemId}/find`,
      { responseType: 'blob' as 'json' }
    );
  }

  deleteDocument(
    fullDocumentId: string,
    dataItemId: string,
    filters: IProjectDetailsFilters
  ): Observable<IProjectDocumentsPagination> {
    const filtersString = setFullAvailableFilters(filters);
    return this.http.delete<IProjectDocumentsPagination>(
      environment.projectDocumebtsBaseUrl +
        `${fullDocumentId}/${dataItemId}/delete${filtersString}`
    );
  }
}
