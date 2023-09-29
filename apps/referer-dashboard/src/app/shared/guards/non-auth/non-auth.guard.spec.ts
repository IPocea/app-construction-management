import { TestBed } from '@angular/core/testing';

import { NonAuth } from './non-auth.guard';

describe('NonAuth', () => {
  let guard: NonAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NonAuth);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
