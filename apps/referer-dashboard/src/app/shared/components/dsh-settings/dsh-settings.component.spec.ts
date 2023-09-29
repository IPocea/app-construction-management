import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DshSettingsComponent } from './dsh-settings.component';

describe('DshSettingsComponent', () => {
  let component: DshSettingsComponent;
  let fixture: ComponentFixture<DshSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DshSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DshSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
