import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDocumentComponent } from './image-document.component';

describe('ImageDocumentComponent', () => {
  let component: ImageDocumentComponent;
  let fixture: ComponentFixture<ImageDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageDocumentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
