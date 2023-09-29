import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LocalStorageService,
  ProjectDetailsParamsService,
  ProjectDetailsService,
  ProjectTabStatusBehaviorService,
} from '@services';

@Component({
  selector: 'referer-me-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss'],
})
export class DashboardSettingsComponent implements OnInit {
  tabType: string = '';
  isOverviewDisplayed: boolean = false;
  areProjectCategoriesDisplayed: boolean = false;
  areSettingsDisplayed: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectTabStatusBehaviorSubject: ProjectTabStatusBehaviorService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.tabType = params['tabType'];
      this.hideTabs();
      this.displaySelectedTab(this.tabType);
      setTimeout(() => {
        if (params && params['tabType']) {
          this.projectTabStatusBehaviorSubject.setNextTabTypeValue({
            areTabsDisplayed: false,
            areDashSettingsTabsDisplayed: true,
          });
        } else {
          this.projectTabStatusBehaviorSubject.setNextTabTypeValue({
            areTabsDisplayed: false,
            areDashSettingsTabsDisplayed: false,
          });
        }
      }, 100);
    });
  }

  private displaySelectedTab(tabType: string): void {
    switch (tabType) {
      case 'overview':
        this.isOverviewDisplayed = true;
        break;
      case 'project-categories':
        this.areProjectCategoriesDisplayed = true;
        break;
      case 'settings':
        this.areSettingsDisplayed = true;
        break;
      default:
        break;
    }
  }

  private hideTabs(): void {
    this.isOverviewDisplayed = false;
    this.areProjectCategoriesDisplayed = false;
    this.areSettingsDisplayed = false;
  }
}
