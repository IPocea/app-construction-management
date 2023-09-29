import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProject, ISendProjectInviteData, IUser } from '@interfaces';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  getProjects(): Observable<IProject[]> {
    return this.http.get<any>(environment.baseUrl + 'project');
  }

  getOneProject(projectId: string): Observable<IProject> {
    return this.http.get<any>(
      environment.baseUrl + `project/${projectId}/find-one`
    );
  }

  addProject(projectName: IProject): Observable<IProject> {
    return this.http.post<IProject>(
      environment.baseUrl + 'project/add',
      projectName
    );
  }

  editProjectById(project: IProject): Observable<IProject> {
    return this.http.patch<IProject>(
      environment.baseUrl + 'project/' + project._id,
      project
    );
  }

  deleteProjectById(projectId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      environment.baseUrl + 'project/' + projectId
    );
  }

  addToRoleIfUserExist(
    projectId: string,
    roleType: string,
    email: string
  ): Observable<IUser> {
    return this.http.get<IUser>(
      environment.baseUrl +
        `project-invite/${projectId}/${roleType}/${email}/add-role-if-user-exists`
    );
  }

  sendInviteEmail(projectInviteData: ISendProjectInviteData): Observable<any> {
    return this.http.post<any>(
      environment.baseUrl + `project-invite/send-invitation`,
      projectInviteData
    );
  }
}
