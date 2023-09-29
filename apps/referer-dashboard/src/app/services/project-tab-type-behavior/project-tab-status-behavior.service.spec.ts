import { TestBed } from '@angular/core/testing';

import { ProjectTabStatusBehaviorService } from './project-tab-status-st.service';

describe('ProjectTabStatusBehaviorService', () => {
  let service: ProjectTabStatusBehaviorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTabStatusBehaviorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
