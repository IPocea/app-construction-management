import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { IProject, IUser } from '@interfaces';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthService,
  NotificationService,
  ProjectIdBehaviorService,
  UserInviteBehaviorService,
} from '@services';
import { ColorsService } from 'app/services/colors/colors.service';
import { LocalStorageService } from 'app/services/local-storage/local-storage.service';
import { environment } from 'environments/environment';
import { finalize, Observable, Subscription, take } from 'rxjs';
import { UserService } from '@services';
import { MatDialog } from '@angular/material/dialog';
import { ProjectEditDialogComponent } from '../project-edit/project-edit.component';
import { ProjectService } from 'app/services/project/project.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  allLanguages: string[] = environment.languages;
  allThemes: string[] = environment.THEMES;
  currentTheme = '';
  currentLanguage = '';
  date = new Date(Date.now());
  projectDetailsSub: Subscription;
  isLoggedIn: boolean = false;
  currentUser: IUser;
  userSubs: Observable<string>;
  allProjects: IProject[] = [];
  selectedProject: IProject = null;
  isUserInviteRouteActive: boolean = false;
  userInviteStatusSub: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private lsService: LocalStorageService,
    private router: Router,
    private translate: TranslateService,
    private dateAdapter: DateAdapter<Date>,
    private colors: ColorsService,
    private projectIdBehaviorService: ProjectIdBehaviorService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog,
    private projectService: ProjectService,
    private userInviteBehaviorService: UserInviteBehaviorService
  ) {
    this.userService.getLoggedInUser().subscribe({
      next: (user: IUser) => {
        this.isLoggedIn = !!user;
        this.currentUser = this.localStorageService.getItem(
          'currentUser'
        ) as IUser;
        if (this.isLoggedIn) {
          this.getAllProjects(true);
        }
      },
    });
    this.userInviteStatusSub =
      this.userInviteBehaviorService.userInviteRouteStatus.subscribe(
        (status) => {
          this.isUserInviteRouteActive = status;
        }
      );
  }

  ngOnInit(): void {
    //  Get current theme and language
    this.currentLanguage =
      (this.lsService.getItem('language') as string) || 'ro';
    let theme = (this.lsService.getItem('theme') as string) || 'auto';
    this.currentTheme = this.getCurrentTheme(theme);
    this.document.body.classList.add(this.currentTheme + 'Theme'); //  Add default theme class to the body of the page
    this.dateAdapter.setLocale(this.currentLanguage);
    this.colors.setComputedStyle();
  }

  deleteProject(): void {
    this.confirmAndDelete(this.selectedProject._id);
  }

  openDialog(actionType: string): void {
    switch (actionType) {
      case 'add-project':
        this.dialog
          .open(ProjectEditDialogComponent, { disableClose: true })
          .afterClosed()
          .subscribe((res) => {
            if (res?.event === 'Add Project') {
              this.getAllProjects(false, 'add-project', res.project);
            }
          });
        break;
      case 'edit-project':
        this.dialog
          .open(ProjectEditDialogComponent, {
            disableClose: true,
            data: {
              project: this.selectedProject,
            },
          })
          .afterClosed()
          .subscribe((res) => {
            if (res?.event === 'Edit Project') {
              this.getAllProjects(false, 'edit-project', res.project);
            }
          });
        break;
      default:
        break;
    }
  }

  selectedValue(event: MatSelectChange): void {
    this.selectedProject = this.allProjects.find(
      (project) => project._id === event.value
    );
    this.checkParamsAndNavigate(event.value);
  }

  logOut(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.localStorageService.removeItem('tokens');
        this.userService.setLoggedInUser(null);
        this.localStorageService.removeItem('currentUser');
        this.router.navigate(['/login']);
      },
      error: (e) => {
        this.notificationService.error(
          e.error.message || 'An unexpected error has occured'
        );
      },
    });
  }

  getCurrentTheme(theme: string): string {
    if (theme === 'auto') {
      theme =
        this.date.getHours() >= 7 && this.date.getHours() <= 20
          ? 'light'
          : 'dark';
    }
    return theme;
  }

  changeTheme(theme: string): void {
    this.currentTheme = this.getCurrentTheme(theme);
    this.document.body.className = '';
    this.document.body.classList.add(this.currentTheme + 'Theme');
    this.lsService.setItem('theme', theme);
    this.colors.setComputedStyle();
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLanguage = lang;
    this.lsService.setItem('language', lang);
    this.dateAdapter.setLocale(lang);
  }

  goBack(): void {
    const menuType = this.localStorageService.getItem('menuType')
      ? (this.localStorageService.getItem('menuType') as string)
      : environment.baseMenuType;
    this.router.navigate(['/dashboard', menuType, this.selectedProject._id]);
  }

  private getAllProjects(
    calledOnConstructor: boolean = false,
    actionType?: string,
    project?: IProject
  ): void {
    this.projectService
      .getProjects()
      .pipe(
        take(1),
        finalize(() => {
          if (calledOnConstructor) {
            this.getAllProjectsFinalizeOnConstructor();
          } else {
            this.getAllProjectsFinalizeNotOnConstructor(actionType, project);
          }
        })
      )
      .subscribe({
        next: (data: IProject[]) => {
          this.allProjects = data.length ? data : [];
        },
        error: (err) => {
          this.notificationService.error(err.error?.message);
        },
      });
  }

  private checkParamsAndNavigate(projectId: string): void {
    const menuType = this.localStorageService.getItem('menuType')
      ? (this.localStorageService.getItem('menuType') as string)
      : environment.baseMenuType;
    this.projectIdBehaviorService.setNextProjectId(this.selectedProject?._id);
    this.router.navigate([`dashboard/${menuType}/${projectId}/settings`]);
  }

  private getAllProjectsFinalizeOnConstructor(): void {
    const projectId = this.projectIdBehaviorService.getProjectId();
    if (projectId) {
      this.selectedProject = this.allProjects.find(
        (item) => item._id === projectId
      );
    } else {
      this.projectIdBehaviorService.setNextProjectId(this.allProjects[0]?._id);
      this.selectedProject = this.allProjects[0] ? this.allProjects[0] : null;
    }
  }

  private getAllProjectsFinalizeNotOnConstructor(
    actionType: string,
    project?: IProject
  ): void {
    switch (actionType) {
      case 'add-project':
        this.selectedProject = project;
        this.projectIdBehaviorService.setNextProjectId(
          this.selectedProject._id
        );
        const menuType = this.localStorageService.getItem('menuType')
          ? (this.localStorageService.getItem('menuType') as string)
          : environment.baseMenuType;
        this.router.navigate([
          `dashboard/${menuType}/${this.selectedProject._id}/settings`,
        ]);
        break;
      case 'edit-project':
        this.selectedProject = project;
        this.projectIdBehaviorService.setNextProjectId(
          this.selectedProject._id
        );
        this.checkParamsAndNavigate(this.selectedProject._id);
        break;
      case 'delete-project':
        this.selectedProject = this.allProjects.length
          ? this.allProjects[0]
          : null;
        this.projectIdBehaviorService.setNextProjectId(
          this.selectedProject?._id
        );
        this.checkParamsAndNavigate(this.selectedProject._id);
        break;
      default:
        break;
    }
  }

  private confirmAndDelete(projectId: string): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        disableClose: true,
        data: {
          title: this.translate.instant('SHARED.DELETE_PROJECT.TITLE'),
          content: this.translate.instant('SHARED.DELETE_PROJECT.CONTENT'),
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.removeProject(projectId);
        }
      });
  }

  private removeProject(projectId: string): void {
    this.projectService
      .deleteProjectById(projectId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.notificationService.info(
            this.selectedProject.name +
              this.translate.instant('SHARED.DELETE_PROJECT.SUCCESS')
          );
          this.getAllProjects(false, 'delete-project');
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  ngOnDestroy(): void {
    this.projectDetailsSub?.unsubscribe();
    this.userInviteStatusSub?.unsubscribe();
  }
}
