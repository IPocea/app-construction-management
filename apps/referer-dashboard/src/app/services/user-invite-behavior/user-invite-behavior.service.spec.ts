import { TestBed } from '@angular/core/testing';

import { UserInviteBehaviorService } from './user-invite-behavior.service';

describe('UserInviteBehaviorService', () => {
  let service: UserInviteBehaviorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInviteBehaviorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
