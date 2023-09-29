import { TestBed } from '@angular/core/testing';

import { DashboardmenuService } from './dashboardmenu.service';

describe('DashboardmenuService', () => {
  let service: DashboardmenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardmenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
