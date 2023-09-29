import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICheckInvitationAndUserResponse, ITokens, IUser } from '@interfaces';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectInviteService {
  private http: HttpClient;
  constructor(private handler: HttpBackend) {
    this.http = new HttpClient(this.handler);
  }

  checkInviteToken(
    inviteToken: string,
    userId: string,
    projectId: string
  ): Observable<ICheckInvitationAndUserResponse> {
    return this.http.get<ICheckInvitationAndUserResponse>(
      environment.baseUrl +
        `project-invite/${userId}/${projectId}/check-invitation-and-user`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${inviteToken}`,
        }),
      }
    );
  }

  loginByEmail(inviteToken: string, user?: IUser): Observable<ITokens> {
    const newUserIdQparam = user ? `?userId=${user._id.toString()}` : '';
    return this.http.get<ITokens>(
      environment.baseUrl + `auth/login/by-email${newUserIdQparam}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${inviteToken}`,
        }),
      }
    );
  }

  findTempUser(inviteToken: string, userId: string): Observable<IUser> {
    return this.http.get<IUser>(
      environment.baseUrl + `project-invite/${userId}/find-temp-user`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${inviteToken}`,
        }),
      }
    );
  }

  deleteTempUser(
    inviteToken: string,
    userId: string
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      environment.baseUrl + `project-invite/${userId}/delete-temp-user`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${inviteToken}`,
        }),
      }
    );
  }

  addUserRoleToProject(
    inviteToken: string,
    projectId: string,
    roleType: string,
    userId: string
  ): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(
      environment.baseUrl +
        `project-invite/${projectId}/${roleType}/${userId}/add-role-to-project`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${inviteToken}`,
        }),
      }
    );
  }

  destroyInviteToken(
    inviteToken: string,
    userId: string
  ): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(
      environment.baseUrl + `project-invite/${userId}/destroy-invite-token`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${inviteToken}`,
        }),
      }
    );
  }
}
