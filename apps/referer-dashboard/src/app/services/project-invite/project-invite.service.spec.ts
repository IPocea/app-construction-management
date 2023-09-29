import { TestBed } from '@angular/core/testing';

import { ProjectInviteService } from './project-invite.service';

describe('ProjectInviteService', () => {
  let service: ProjectInviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectInviteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
