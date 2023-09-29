import { Injectable } from '@angular/core';
import { ITabStatus } from '@interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectTabStatusBehaviorService {
  // tabType: string = 'dashboard';
  tabs: ITabStatus = {
    areTabsDisplayed: false,
    areDashSettingsTabsDisplayed: false,
  };
  tabTypeStatus: BehaviorSubject<any>;

  constructor() {
    this.tabTypeStatus = new BehaviorSubject(this.tabs);
  }

  setNextTabTypeValue(tabs: ITabStatus): void {
    this.tabTypeStatus.next(tabs);
  }

  getTabTypeValue(): boolean {
    return this.tabTypeStatus.value;
  }
}
