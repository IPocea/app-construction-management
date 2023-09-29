import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProjectDocumentsPagination } from '@interfaces';
import { NotificationService, ProjectUploadDocumentsService } from '@services';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'referer-me-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit, OnDestroy {
  selected_files: {
    file: any;
    is_upload_in_progress: boolean;
    upload_result: any;
  }[] = [];

  @ViewChild('fileSelector', { static: false }) file_selector!: ElementRef;
  config: {
    MIME_types_accepted: string;
    is_multiple_selection_allowed: boolean;
    data: any;
  };
  file_selection_form: FormGroup;

  // Subscriptions
  private file_selection_sub!: Subscription;
  private file_upload_sub!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectUploadDocumentsService: ProjectUploadDocumentsService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<UploadFileComponent>
  ) {
    this.file_selection_form = new FormGroup({
      file_selection: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.config = this.data;
    this.trackFileSelection();
  }

  openFileSelector(): void {
    const file_selection = this.file_selector.nativeElement;
    file_selection.click();
  }

  trackFileSelection(): void {
    this.file_selection_sub = this.file_selection_form
      .get('file_selection')
      ?.valueChanges.subscribe(() => {
        const file_selection = this.file_selector.nativeElement;
        this.selectFiles(file_selection.files);
        this.file_selector.nativeElement.value = '';
      }) as Subscription;
  }

  selectFiles(event: any): void {
    const incoming_files = event;
    let incoming_file_count = incoming_files.length;
    let incorrect_MIME_type = false;
    for (let i = 0; i < incoming_file_count; i++) {
      let incoming_file = incoming_files[i];
      // Checking if size is biggern then 4MB and if MIME type is acceptable 4194304
      if (incoming_file.size > 4194304) {
        this.notificationService.error('A file size cannot exceed 4MB');
      } else if (
        !!!this.config.MIME_types_accepted ||
        this.config.MIME_types_accepted.indexOf(incoming_file.type) >= 0 ||
        /^image\//.test(incoming_file.type)
      ) {
        let selected_file = {
          file: incoming_file,
          is_upload_in_progress: false,
          upload_result: null,
        };
        this.selected_files.push(selected_file);
      } else {
        incorrect_MIME_type = true;
      }
    }
    // Display error
    if (incorrect_MIME_type) {
      let message =
        'Only files of the following types are allowed: ' +
        this.config.MIME_types_accepted;
      this.notificationService.error(message);
    }
    setTimeout(() => {
      if (this.selected_files.length >= 10) {
        this.selected_files = this.selected_files.slice(0, 10);
        this.notificationService.error('Only 10 files per upload are allowed');
      }
    }, 150);
  }

  uploadFile(index: number): void {
    let file_for_upload = this.selected_files[index];

    const form_data = new FormData();
    form_data.append('files', file_for_upload.file);

    // For other fields, we have to use append() as well
    // E.g. form_data.append('thikana', 'Bishadbari Lane');

    file_for_upload.is_upload_in_progress = true;
    file_for_upload.upload_result = null;

    this.file_upload_sub = this.projectUploadDocumentsService
      .uploadFiles(form_data, this.config.data.documents._id)
      .pipe(
        finalize(() => {
          if (!this.isAnyFileNotUploaded()) {
            this.cancelAll('Upload Finished');
          }
        })
      )
      .subscribe({
        next: (documentsData) => {
          // this.sendDocuments.emit(documentsData);
          file_for_upload.upload_result = 'success';
          file_for_upload.is_upload_in_progress = false;
        },
        error: (error) => {
          file_for_upload.upload_result = error.error.message;
          file_for_upload.is_upload_in_progress = false;
        },
      });
  }

  uploadAll(): void {
    let selected_file_count = this.selected_files.length;
    for (let i = 0; i < selected_file_count; i++) {
      let selected_file = this.selected_files[i];
      // Checking if the file can be uploaded
      if (
        !selected_file.is_upload_in_progress &&
        selected_file.upload_result !== 'success'
      ) {
        this.uploadFile(i);
      }
    }
  }

  inititateFileCancel(index: number): void {
    this.cancelFile(index);
  }

  cancelFile(index: number) {
    this.selected_files.splice(index, 1);
  }

  initiateCancelAll(): void {
    let selected_file_count = this.selected_files.length;
    let is_any_file_being_uploaded = false;
    for (let i = 0; i < selected_file_count; i++) {
      let selected_file = this.selected_files[i];
      // Checking if the file is being uploaded
      if (selected_file.is_upload_in_progress) {
        is_any_file_being_uploaded = true;
        break;
      }
    }
    this.cancelAll('Close Dialog');
  }

  cancelAll(actionType: string): void {
    let selected_file_count = this.selected_files.length;
    for (let i = 0; i < selected_file_count; i++) {
      this.selected_files.splice(0, 1);
    }
    this.dialogRef.close({ event: actionType });
  }

  closeUploadDialog(): void {
    this.dialogRef.close({ event: 'Close Dialog' });
  }

  isAnyFileNotUploaded() {
    let selected_file_count = this.selected_files.length;
    let is_any_file_not_uploaded = false;
    for (let i = 0; i < selected_file_count; i++) {
      let selected_file = this.selected_files[i];
      // Checking if the file can be uploaded
      if (
        !selected_file.is_upload_in_progress &&
        selected_file.upload_result != 'success'
      ) {
        is_any_file_not_uploaded = true;
        break;
      }
    }
    return is_any_file_not_uploaded;
  }

  ngOnDestroy(): void {
    this.file_selection_sub?.unsubscribe();
    this.file_upload_sub?.unsubscribe();
  }
}
