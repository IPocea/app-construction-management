import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import {
  IProject,
  IProjectDetailsFilters,
  IProjectDocumentsData,
  IProjectDocumentsPagination,
  IUser,
} from '@interfaces';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import {
  ProjectUploadDocumentsService,
  LocalStorageService,
  NotificationService,
  UserService,
} from '@services';
import { finalize, Subscription, take } from 'rxjs';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { ImageDocumentComponent } from '../image-document/image-document/image-document.component';
import { UsersRoles } from '@utils/roles.enum';

@Component({
  selector: 'referer-me-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit, OnDestroy {
  @Input() documentsData: IProjectDocumentsPagination;
  @Input() selectedProject: IProject;
  @Output() sendFiltersFromDocuments = new EventEmitter<any>();
  @Output() sendDocuments = new EventEmitter<IProjectDocumentsData>();
  currentUser: IUser = null;
  ADMIN = UsersRoles.Admin;
  EDITOR = UsersRoles.Editor;
  isLoading: boolean = false;
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[] = [];
  filters: IProjectDetailsFilters = null;
  searchValue: string = '';
  typingTimer: ReturnType<typeof setTimeout>;
  typingInt: number = 350;
  baseUrl: string = '';
  isDragAndDropDisplayed: boolean = false;
  selectedDocument: IProjectDocumentsData = null;
  pdfSrc = null;
  imgUrl = null;
  config = {
    MIME_types_accepted: 'application/pdf,image/*',
    is_multiple_selection_allowed: true,
    data: null,
  };
  translateSubscription: Subscription;
  uploadBtnValue: string = '';
  constructor(
    public dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private projectUploadDocumentsService: ProjectUploadDocumentsService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {
    this.translateSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.uploadBtnValue = this.isDragAndDropDisplayed
          ? event.translations.DASHBOARD_DOCUMENTS.CLOSE_UPLOAD_FIELD
          : event.translations.DASHBOARD_DOCUMENTS.OPEN_UPLOAD_FIELD;
      }
    );
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.baseUrl = environment.projectDocumebtsBaseUrl;
    this.config.data = this.documentsData;
    this.setPaginator(this.documentsData);
  }

  ngOnChanges(changes: SimpleChange): void {
    this.resetSrcAndSelectedDocument();
    this.config.data = this.documentsData;
    this.setPaginator(this.documentsData);
    this.isLoading = false;
  }

  applySearchFilter(): void {
    this.clearTimeout();
    this.typingTimer = setTimeout(
      this.searchByValue.bind(this),
      this.typingInt
    );
  }

  clearTimeout(): void {
    clearTimeout(this.typingTimer);
  }

  clearSearchValue(): void {
    this.searchValue = '';
    this.searchByValue();
  }

  deleteDocument(document: IProjectDocumentsData): void {
    this.isLoading = true;
    this.confirmAndDelete(document);
  }

  handlePageChange(ev: any): void {
    this.resetFiltersObj();
    this.filters = {
      pageIndex: ev.pageIndex.toString(),
      pageSize: ev.pageSize.toString(),
    };
    this.requestFilteredData(this.filters);
  }

  sendDocs(ev: any): void {
    this.sendDocuments.emit(ev);
  }

  showDocument(document: IProjectDocumentsData): void {
    this.resetSrcAndSelectedDocument();
    const screenWidth: number = window.screen.availWidth;
    if (screenWidth >= 900) {
      if (document.mimeType === 'application/pdf') {
        this.getBlobUrl('pdf', this.documentsData.documents._id, document.id);
      } else if (document.mimeType.includes('image/')) {
        this.getBlobUrl('image', this.documentsData.documents._id, document.id);
      }
      this.selectedDocument = document;
    } else {
      this.dialog
        .open(ImageDocumentComponent, {
          disableClose: true,
          data: {
            fullDocument: this.documentsData.documents,
            selectedDocument: document,
          },
          width: '100vw',
        })
        .afterClosed()
        .subscribe((res) => {});
    }
  }

  requestFilteredData(fitlers: IProjectDetailsFilters): void {
    this.isLoading = true;
    this.sendFiltersFromDocuments.emit(fitlers);
  }

  openDragAndDrop(): void {
    this.dialog
      .open(UploadFileComponent, {
        disableClose: true,
        data: this.config,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res?.event === 'Upload Finished') {
          this.notificationService.info(
            this.translate.instant('UPLOAD_FILE.UPLOADS_SUCCESS')
          );
          this.requestFilteredData(this.filters);
        }
      });
  }

  private confirmAndDelete(document: IProjectDocumentsData): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        disableClose: true,
        data: {
          title: this.translate.instant(
            'DASHBOARD_DOCUMENTS.DELETE_CONFIRMATION.TITLE'
          ),
          content: this.translate.instant(
            'DASHBOARD_DOCUMENTS.DELETE_CONFIRMATION.CONTENT'
          ),
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.removeDocument(this.documentsData.documents._id, document.id);
        } else {
          this.isLoading = false;
        }
      });
  }

  private getBlobUrl(documentType: string, fullDocumentId: string, dataItemId: string): void {
    this.projectUploadDocumentsService
      .getImgBlob(fullDocumentId, dataItemId)
      .pipe(take(1))
      .subscribe({
        next: (data: Blob) => {
          this.createImageFromBlob(data, documentType);
        },
        error: (err) => {},
      });
  }

  private createImageFromBlob(image: Blob, documentType: string) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        if(documentType === 'image') {
          this.imgUrl = reader.result;
        } else if(documentType === 'pdf') {
          this.pdfSrc = reader.result;
        }
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  private removeDocument(fullDocumentId: string, dataItemId: string): void {
    this.projectUploadDocumentsService
      .deleteDocument(fullDocumentId, dataItemId, this.filters)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.sendDocs(data);
        },
        error: (err) => {},
      });
  }

  private setPaginator(documentsData: IProjectDocumentsPagination): void {
    this.pageIndex = documentsData.pageIndex;
    this.pageSize = documentsData.pageSize;
    this.length = documentsData.totalItems;
    this.pageSizeOptions = [10, 25, 50];
  }

  private resetFiltersObj(): void {
    this.filters = null;
  }

  private resetSrcAndSelectedDocument(): void {
    this.pdfSrc = null;
    this.imgUrl = null;
    this.selectedDocument = null;
  }

  private searchByValue(): void {
    this.resetFiltersObj();
    this.filters = {
      pageIndex: '0',
      pageSize: this.pageSize.toString(),
    };
    if (this.searchValue.trim()) {
      this.filters.searchValue = this.searchValue.trim();
    }
    this.requestFilteredData(this.filters);
  }

  ngOnDestroy(): void {
    this.translateSubscription?.unsubscribe();
  }
}
