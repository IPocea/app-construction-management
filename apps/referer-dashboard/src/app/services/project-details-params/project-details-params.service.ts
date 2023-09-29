import { Injectable } from '@angular/core';
import { IProjectDetailsParams } from '@interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectDetailsParamsService {
  projectDetails: IProjectDetailsParams = {
    itemId: '',
    tabType: '',
  };
  projectIdData: BehaviorSubject<IProjectDetailsParams | null>;

  constructor() {
    this.projectIdData = new BehaviorSubject(this.projectDetails);
  }

  setNextProjectDetailsParams(projectId: IProjectDetailsParams): void {
    this.projectIdData.next(projectId);
  }

  getProjectDetailsParams(): IProjectDetailsParams {
    return this.projectIdData.value;
  }
}
