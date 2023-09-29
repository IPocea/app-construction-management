import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  DashboardMenuService,
  ProjectDetailsParamsService,
  ProjectIdBehaviorService,
  ProjectTabStatusBehaviorService,
  LocalStorageService,
  UserService,
  ProjectService,
} from '@services';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IDynamicNestedMenu,
  IMenuData,
  IProject,
  IProjectDetailsParams,
  IUser,
} from '@interfaces';
import { finalize, Subscription, take } from 'rxjs';
import { numberRegExp } from '@utils/regexp';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: IUser = null;
  menuType: string = this.localStorageService.getItem('menuType')
    ? (this.localStorageService.getItem('menuType') as string)
    : environment.baseMenuType;
  projectId: string = '';
  selectedProject: IProject = null;
  projectDetailsParams: IProjectDetailsParams = null;
  tabType: string = 'data-costs';
  dashboardSettingsTabType: string = 'settings';
  areTabsDisplayed: boolean = false;
  areDashSettingsTabsDisplayed: boolean = false;
  menuData: IMenuData[] = null;
  dynamicMenuData: IDynamicNestedMenu = null;
  projectIdSubscription: Subscription;
  projectDetailsParamsSubscription: Subscription;
  tabStatusSubscription: Subscription;
  authorisationPatern: RegExp = numberRegExp();
  isMenuOpen: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dashboardMenuService: DashboardMenuService,
    private projectDetailsParamsService: ProjectDetailsParamsService,
    private projectIdBehaviorService: ProjectIdBehaviorService,
    private projectTabStatusBehaviorSubject: ProjectTabStatusBehaviorService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.menuType = params['menuType'];
      this.projectId = params['projectId'];
      this.projectDetailsParams = {
        menuType: this.menuType,
        projectId: this.projectId,
      };
      this.projectIdBehaviorService.setNextProjectId(this.projectId);
      this.localStorageService.setItem('menuType', this.menuType);
      setTimeout(() => {
        this.findSelectedProjectAndMenu();
      }, 100);
    });
    this.userService
      .getProfile()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.userService.addCurrentUser(data);
          this.currentUser = data;
        },
        error: (err) => {},
      });
    if (
      window.location.pathname
        .slice(window.location.pathname.lastIndexOf('/'))
        .includes('data-costs') ||
      window.location.pathname
        .slice(window.location.pathname.lastIndexOf('/') + 1)
        .includes('documents')
    ) {
      this.tabType = window.location.pathname.slice(
        window.location.pathname.lastIndexOf('/') + 1
      );
    }

    this.projectDetailsParamsSubscription =
      this.projectDetailsParamsService.projectIdData.subscribe((data) => {
        this.projectDetailsParams.itemId = data?.itemId;
        this.projectDetailsParams.tabType = data?.tabType;
      });
    this.tabStatusSubscription =
      this.projectTabStatusBehaviorSubject.tabTypeStatus.subscribe(
        (tabStatus) => {
          this.areTabsDisplayed = tabStatus.areTabsDisplayed;
          this.areDashSettingsTabsDisplayed =
            tabStatus.areDashSettingsTabsDisplayed;
        }
      );
  }

  getData(tab: string): void {
    this.tabType = tab;
    if (
      this.projectId &&
      this.projectDetailsParams?.itemId &&
      this.projectId !== 'undefined'
    ) {
      this.router.navigate([
        `/dashboard/${this.menuType}/${this.projectId}/project-details`,
        this.projectDetailsParams.itemId,
        this.tabType,
      ]);
    }
  }

  choseDashboardSettingsTab(tab: string): void {
    this.dashboardSettingsTabType = tab;
    if (this.projectId && this.projectId !== 'undefined') {
      this.router.navigate([
        `/dashboard/${this.menuType}/${this.projectId}/${this.dashboardSettingsTabType}`,
      ]);
    }
  }

  setStateOfMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    const menuState = this.isMenuOpen ? 'open' : '';
    this.localStorageService.setItem('menuState', menuState);
  }

  private getStaticMenu(): void {
    this.dashboardMenuService
      .getStaticMenu()
      .pipe(take(1))
      .subscribe({
        next: (data: IMenuData[]) => {
          this.menuData = data;
          this.setMenuAndNavigate();
        },
        error: (err) => {
          // if we put a notificationService error message it will overwrite the notification Refresh Token
          // has expired when the refresh token will be expired
          console.log(err);
        },
      });
  }

  private getDynamicMenu(): void {
    this.dashboardMenuService
      .getDynamicMenu(this.projectId)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          // data here is an object or null if not found
          if (data) {
            this.menuData = data.children;
            this.dynamicMenuData = data;
            this.setMenuAndNavigate();
          }
        },
        error: (err) => {},
      });
  }

  private setMenuAndNavigate(): void {
    if (this.localStorageService.getItem('menuState')) {
      this.isMenuOpen = true;
    }
    this.router.navigate([
      `/dashboard/${this.menuType}/${
        this.projectId ? this.projectId : 'no-project-selected'
      }/${
        this.dashboardSettingsTabType
          ? this.dashboardSettingsTabType
          : 'settings'
      }`,
    ]);
  }

  private findSelectedProjectAndMenu(): void {
    this.projectService
      .getOneProject(this.projectId)
      .pipe(
        take(1),
        finalize(() => {
          if (this.menuType === 'static') {
            this.getStaticMenu();
          } else if (this.menuType === 'dynamic') {
            this.getDynamicMenu();
          }
        })
      )
      .subscribe({
        next: (project) => {
          this.selectedProject = project;
        },
        error: (err) => {},
      });
  }

  ngOnDestroy(): void {
    this.projectDetailsParamsSubscription?.unsubscribe();
    this.projectIdSubscription?.unsubscribe();
    this.tabStatusSubscription?.unsubscribe();
  }
}
