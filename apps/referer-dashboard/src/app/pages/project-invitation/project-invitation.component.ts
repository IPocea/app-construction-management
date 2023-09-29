import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICheckInvitationAndUserResponse,
  IProject,
  ITokens,
  IUser,
} from '@interfaces';
import {
  LocalStorageService,
  NotificationService,
  ProjectIdBehaviorService,
  ProjectInviteService,
} from '@services';
import { environment } from 'environments/environment';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'referer-me-project-invitation',
  templateUrl: './project-invitation.component.html',
  styleUrls: ['./project-invitation.component.scss'],
})
export class ProjectInvitationComponent implements OnInit, OnDestroy {
  userId: string = '';
  token: string = '';
  projectId: string = '';
  user: IUser = null;
  project: IProject = null;
  queryParamsSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectInviteService: ProjectInviteService,
    private notificationService: NotificationService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private projectIdBehaviorService: ProjectIdBehaviorService
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
  }

  private getQueryParams(): void {
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(
      (qParams) => {
        this.userId = qParams['userId'];
        this.token = qParams['token'];
        this.projectId = qParams['projectId'];
        this.checkInviteTokenAndGetData();
      }
    );
  }

  private checkInviteTokenAndGetData(): void {
    this.projectInviteService
      .checkInviteToken(this.token, this.userId, this.projectId)
      .pipe(take(1))
      .subscribe({
        next: (data: ICheckInvitationAndUserResponse) => {
          this.user = data.user;
          this.project = data.project;
          const menuType = this.localStorageService.getItem('menuType')
            ? (this.localStorageService.getItem('menuType') as string)
            : environment.baseMenuType;
          if (this.user.isTemporary) {
            this.localStorageService.removeItem('tokens');
            this.router.navigate(['/registration'], {
              queryParams: {
                userId: this.userId,
                token: this.token,
                projectId: this.projectId,
              },
            });
          } else {
            this.login(menuType);
          }
        },
        error: (err) => {
          if (
            err instanceof HttpErrorResponse &&
            err.status === 403 &&
            (err.error.message === 'The invite token has expired' ||
              err.error.message === 'Access Denied')
          ) {
            this.notificationService.error(
              err.error.message +
                '. Please ask the project admin for an invitation'
            );
          }
          this.localStorageService.removeItem('tokens');
          this.router.navigate(['/login']);
        },
      });
  }

  private login(menuType: string): void {
    this.projectInviteService
      .loginByEmail(this.token)
      .pipe(take(1))
      .subscribe({
        next: (tokens: ITokens) => {
          this.localStorageService.setItem('tokens', tokens);
          this.projectIdBehaviorService.setNextProjectId(this.projectId);
          this.router.navigate(['/dashboard', menuType, this.projectId]);
        },
        error: (err) => {
          this.notificationService.error(
            err.error.message +
              '. Please ask the project admin for an invitation'
          );
          this.localStorageService.removeItem('tokens');
          this.router.navigate(['/login']);
        },
      });
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
  }
}
