import { TestBed } from '@angular/core/testing';

import { ProjectIdBehaviorService } from './project-id-behavior.service';

describe('ProjectIdBehaviorService', () => {
  let service: ProjectIdBehaviorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectIdBehaviorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
