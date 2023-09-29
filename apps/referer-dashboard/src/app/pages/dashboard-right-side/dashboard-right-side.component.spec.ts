import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRightSideComponent } from './dashboard-right-side.component';

describe('DashboardRightSideComponent', () => {
  let component: DashboardRightSideComponent;
  let fixture: ComponentFixture<DashboardRightSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardRightSideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRightSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
