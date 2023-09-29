import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectIdBehaviorService {
  projectId: string = '';
  projectIdData: BehaviorSubject<string>;

  constructor() {
    this.projectIdData = new BehaviorSubject(this.projectId);
  }

  setNextProjectId(projectId: string): void {
    this.projectIdData.next(projectId);
  }

  getProjectId(): string {
    return this.projectIdData.value;
  }
}
