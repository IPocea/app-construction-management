import { TestBed } from '@angular/core/testing';

import { ProjectUploadDocumentsService } from './project-upload-documents.service';

describe('ProjectUploadDocumentsService', () => {
  let service: ProjectUploadDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectUploadDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
