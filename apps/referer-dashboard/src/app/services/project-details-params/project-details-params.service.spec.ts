import { TestBed } from '@angular/core/testing';

import { ProjectDetailsParamsService } from './project-details-params.service';

describe('ProjectDetailsParamsService', () => {
  let service: ProjectDetailsParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectDetailsParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
