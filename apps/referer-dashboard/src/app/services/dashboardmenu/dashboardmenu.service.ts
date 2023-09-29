import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IDynamicMenu,
  IDynamicMenuEditBody,
  IDynamicNestedMenu,
} from '@interfaces';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardMenuService {
  static menuDasheboardService() {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  getStaticMenu(): Observable<any> {
    return this.http.get<any>(environment.baseUrl + 'menu');
  }

  getDynamicMenu(projectId: string): Observable<any> {
    return this.http.get<any>(
      environment.baseUrl + 'dynamic-menu/' + projectId
    );
  }

  addDynamicMenuItem(
    projectId: string,
    newItem: IDynamicMenu
  ): Observable<IDynamicNestedMenu> {
    return this.http.post<IDynamicNestedMenu>(
      environment.baseUrl + `dynamic-menu/${projectId}/add`,
      newItem
    );
  }

  editDyanmicMenuItem(
    menuItemId: string,
    editBody: IDynamicMenuEditBody
  ): Observable<IDynamicNestedMenu> {
    return this.http.patch<IDynamicNestedMenu>(
      environment.baseUrl + `dynamic-menu/${menuItemId}/edit`,
      editBody
    );
  }

  findOneMenuItem(menuItemId: string): Observable<IDynamicMenu> {
    return this.http.get<IDynamicMenu>(
      environment.baseUrl + `dynamic-menu/${menuItemId}/find-one`
    );
  }

  deleteTask(menuItemId: string): Observable<any> {
    return this.http.delete<any>(
      environment.baseUrl + `dynamic-menu/${menuItemId}/delete-task`
    );
  }

  deleteCategory(menuItemId: string): Observable<any> {
    return this.http.delete<any>(
      environment.baseUrl + `dynamic-menu/${menuItemId}/delete-category`
    );
  }
}
