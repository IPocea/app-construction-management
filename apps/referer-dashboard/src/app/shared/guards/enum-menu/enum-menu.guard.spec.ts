import { TestBed } from '@angular/core/testing';

import { EnumMenuGuard } from './enum-menu.guard';

describe('EnumMenuGuard', () => {
  let guard: EnumMenuGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EnumMenuGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
