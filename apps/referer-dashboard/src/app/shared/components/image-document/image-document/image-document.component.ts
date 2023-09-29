import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProjectDocuments, IProjectDocumentsData } from '@interfaces';
import { LocalStorageService, ProjectUploadDocumentsService } from '@services';
import { environment } from 'environments/environment';
import { take } from 'rxjs';

@Component({
  selector: 'referer-me-image-document',
  templateUrl: './image-document.component.html',
  styleUrls: ['./image-document.component.scss'],
})
export class ImageDocumentComponent implements OnInit {
  fullDocument: IProjectDocuments = null;
  selectedDocument: IProjectDocumentsData = null;
  pdfSrc = null;
  imgUrl = null;
  baseUrl: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImageDocumentComponent>,
    private projectUploadDocumentsService: ProjectUploadDocumentsService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.fullDocument = this.data?.fullDocument;
    this.selectedDocument = this.data?.selectedDocument;
    this.baseUrl = environment.projectDocumebtsBaseUrl;
    if (this.selectedDocument?.mimeType === 'application/pdf') {
      this.pdfSrc = {
        url:
          this.baseUrl +
          `${this.fullDocument?._id}/${this.selectedDocument?.id}/find`,
        httpHeaders: {
          Authorization: `Bearer ${
            this.localStorageService.getItem('tokens')['accessToken']
          }`,
        },
        withCredentials: true,
      };
    } else if (this.selectedDocument?.mimeType.includes('image/')) {
      this.getBlobUrl(this.fullDocument?._id, this.selectedDocument?.id);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private getBlobUrl(fullDocumentId: string, dataItemId: string): void {
    this.projectUploadDocumentsService
      .getImgBlob(fullDocumentId, dataItemId)
      .pipe(take(1))
      .subscribe({
        next: (data: Blob) => {
          this.createImageFromBlob(data);
        },
        error: (err) => {},
      });
  }

  private createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.imgUrl = reader.result;
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
