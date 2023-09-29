import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMenuCategoryDialogComponent } from './add-edit-menu-category-dialog.component';

describe('AddEditMenuCategoryDialogComponent', () => {
  let component: AddEditMenuCategoryDialogComponent;
  let fixture: ComponentFixture<AddEditMenuCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditMenuCategoryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditMenuCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
