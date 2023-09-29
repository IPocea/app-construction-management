import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IProject,
  IProjectDashboard,
  IProjectDataCostsPagination,
  IProjectDetailsFilters,
  IProjectDetailsParams,
  IProjectDocumentsPagination,
} from '@interfaces';
import {
  ProjectDetailsParamsService,
  ProjectDetailsService,
  ProjectService,
  ProjectTabStatusBehaviorService,
} from '@services';
import { environment } from 'environments/environment';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'referer-me-dashboard-right-side',
  templateUrl: './dashboard-right-side.component.html',
  styleUrls: ['./dashboard-right-side.component.scss'],
})
export class DashboardRightSideComponent implements OnInit, OnDestroy {
  projectParams: IProjectDetailsParams = null;
  selectedProject: IProject = null;
  dashboardData: IProjectDashboard = null;
  dataCostsData: IProjectDataCostsPagination = null;
  documentsData: IProjectDocumentsPagination = null;
  isProjectSelected: boolean = true;
  isItemSelected: boolean = true;
  isDashboardDisplayed: boolean = false;
  areDataCostsDisplayed: boolean = false;
  areDocumentsDisplayed: boolean = false;
  defaultFilters: IProjectDetailsFilters = {
    pageIndex: '0',
    pageSize: '10',
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectDetailsService: ProjectDetailsService,
    private router: Router,
    private projectDetailsParamsService: ProjectDetailsParamsService,
    private projectTabStatusBehaviorSubject: ProjectTabStatusBehaviorService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.projectParams = {
        menuType: params['menuType'],
        projectId: params['projectId'],
        itemId: params['itemId'],
        tabType: params['tabType'],
      };
      if (this.projectParams.projectId === 'no-project-selected') {
        this.isProjectSelected = false;
        this.projectTabStatusBehaviorSubject.setNextTabTypeValue({
          areTabsDisplayed: false,
          areDashSettingsTabsDisplayed: false,
        });
      } else if (this.projectParams.itemId.toString() === 'no-item-selected') {
        this.isProjectSelected = true;
        this.isItemSelected = false;
        this.projectTabStatusBehaviorSubject.setNextTabTypeValue({
          areTabsDisplayed: false,
          areDashSettingsTabsDisplayed: false,
        });
      } else if (!this.projectParams.itemId || !this.projectParams.tabType) {
        this.projectTabStatusBehaviorSubject.setNextTabTypeValue({
          areTabsDisplayed: false,
          areDashSettingsTabsDisplayed: false,
        });
        this.router.navigate([
          '/dashboard',
          this.projectParams.menuType,
          this.projectParams.projectId,
        ]);
      } else {
        this.isProjectSelected = true;
        this.isItemSelected = true;
        this.projectDetailsParamsService.setNextProjectDetailsParams(
          this.projectParams
        );
        this.findSelectedProjectAndDetails();
      }
    });
  }

  getUploadedDocuments(ev: any): void {
    this.documentsData = ev;
  }

  requestDataCostsData(ev: any): void {
    this.getProjectDetails(this.projectParams, ev);
  }

  requestDocumentsData(ev: any): void {
    this.getProjectDetails(this.projectParams, ev);
  }

  private getProjectDetails(
    projectParams: IProjectDetailsParams,
    filters: IProjectDetailsFilters
  ): void {
    this.projectDetailsService
      .getProjectDetails(projectParams, filters)
      .pipe(take(1))
      .subscribe({
        next: (projectData) => {
          this.projectTabStatusBehaviorSubject.setNextTabTypeValue({
            areTabsDisplayed: true,
            areDashSettingsTabsDisplayed: false,
          });
          this.hideTabs();
          this.hideNoSelectedMessages();
          this.populateSelectedData(this.projectParams.tabType, projectData);
          this.displaySelectedTab(this.projectParams.tabType);
        },
        error: (err) => {
          this.hideNoSelectedMessages();
          console.log(err);
        },
      });
  }

  private displaySelectedTab(tabType: string): void {
    switch (tabType) {
      case 'dashboard':
        this.isDashboardDisplayed = true;
        break;
      case 'data-costs':
        this.areDataCostsDisplayed = true;
        break;
      case 'documents':
        this.areDocumentsDisplayed = true;
        break;
      default:
        break;
    }
  }

  private findSelectedProjectAndDetails(): void {
    this.projectService
      .getOneProject(this.projectParams?.projectId)
      .pipe(
        take(1),
        finalize(() => {
          if (this.projectParams.tabType === 'data-costs') {
            this.getProjectDetails(this.projectParams, this.defaultFilters);
          } else {
            this.getProjectDetails(this.projectParams, null);
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

  private hideTabs(): void {
    this.areDataCostsDisplayed = false;
    this.areDocumentsDisplayed = false;
    this.isDashboardDisplayed = false;
  }

  private hideNoSelectedMessages(): void {
    this.isProjectSelected = true;
    this.isItemSelected = true;
  }

  private populateSelectedData(tabType: string, projectData: any): void {
    switch (tabType) {
      case 'dashboard':
        this.dashboardData = projectData;
        break;
      case 'data-costs':
        this.dataCostsData = projectData;
        break;
      case 'documents':
        this.documentsData = projectData;
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.projectDetailsParamsService.setNextProjectDetailsParams(null);
  }
}
