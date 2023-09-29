import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import {
  IProject,
  IProjectDataCostsItem,
  IProjectDataCostsPagination,
  IProjectDetailsFilters,
  IUser,
} from '@interfaces';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataCostsEditDialogComponent } from '@shared/components/data-costs-edit-dialog-component/data-costs-edit-dialog.component';
import {
  NotificationService,
  ProjectDetailsService,
  UserService,
} from '@services';
import { finalize, Subscription, take } from 'rxjs';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { UsersRoles } from '@utils/roles.enum';
import { BooleanInput } from '@angular/cdk/coercion';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss'],
})
export class MatTableComponent implements OnInit, OnDestroy {
  @Input() dataCostsData: any;
  @Input() selectedProject: IProject;
  @Output() sendFilters = new EventEmitter<any>();
  @ViewChild(MatSort) sort: MatSort;
  currentUser: IUser = null;
  isLoading: boolean = false;
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[] = [];
  showFirstLastButtons: BooleanInput = true;
  searchValue: string = '';
  typingTimer: ReturnType<typeof setTimeout>;
  typingInt: number = 350;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = [];
  tableDialogRef: MatDialogRef<DataCostsEditDialogComponent>;
  confirmDialogRef: MatDialogRef<ConfirmationDialogComponent>;
  currentItemId: string;
  filters: IProjectDetailsFilters = null;
  translateSubscription: Subscription;
  noItemTranslate: string = '';
  constructor(
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private projectDetailsService: ProjectDetailsService,
    private translate: TranslateService,
    private userService: UserService
  ) {
    this.translateSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.noItemTranslate = event.translations.MAT_TABLE.NO_ITEM;
        this.requestFilteredData(this.filters);
      }
    );
  }
  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.noItemTranslate = this.translate.instant('MAT_TABLE.NO_ITEM');
    // if there is data then make the table headers, if not table header = no item added
    const data = { ...this.dataCostsData };
    this.checkIfDataAndUpdate(data);
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource<any>(
      this.dataCostsData.dataCosts.data
    );
    this.setPaginator(this.dataCostsData);
    // in order to sort by letter and not let Capital letters to less points on compare
    // we need on string to make all lower case
    this.dataSource.sortingDataAccessor = (
      data: any,
      sortHeaderId: string
    ): string => {
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLocaleLowerCase();
      }
      return data[sortHeaderId];
    };
    this.currentItemId = this.dataCostsData.dataCosts.itemId;
  }

  // when data from parent change we need to update the table with the new data
  ngOnChanges(changes: SimpleChange): void {
    const data = { ...this.dataCostsData };
    this.checkIfDataAndUpdate(data);
    this.setPaginator(this.dataCostsData);
    if (this.currentItemId !== this.dataCostsData.dataCosts.itemId) {
      this.resetSort();
      this.searchValue = '';
    }
    this.dataSource.data = changes['dataCostsData']?.currentValue.dataCosts.data;
    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getEventValue($event: any): string {
    return ($event.target as HTMLInputElement).value;
  }

  // on keyup we clear timeout and start a timeout with our search filters
  // on keydown we clear timeout
  // when user stop typing, after 350 ms, the call is made to database
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

  deleteItem(dataItemId: string): void {
    this.isLoading = true;
    this.confirmAndDelete(dataItemId);
  }

  handlePageChange(ev: any): void {
    this.resetFiltersObj();
    this.filters = {
      pageIndex: ev.pageIndex.toString(),
      pageSize: ev.pageSize.toString(),
    };
    if (this.sort.active || this.sort.direction !== '') {
      this.filters.sortBy = this.sort.active;
      this.filters.sortDirection = this.sort.direction;
    }
    if (this.searchValue.trim()) {
      this.filters.searchValue = this.searchValue.trim();
    }
    this.requestFilteredData(this.filters);
  }

  sortData(sort: Sort) {
    this.resetFiltersObj();
    this.filters = {
      pageIndex: '0',
      pageSize: this.pageSize.toString(),
    };
    if (sort.active || sort.direction !== '') {
      this.filters.sortBy = sort.active;
      this.filters.sortDirection = sort.direction;
    }
    if (this.searchValue.trim()) {
      this.filters.searchValue = this.searchValue.trim();
    }
    this.requestFilteredData(this.filters);
  }

  requestFilteredData(fitlers: IProjectDetailsFilters): void {
    this.isLoading = true;
    this.sendFilters.emit(fitlers);
  }

  openTableForm(actionType: string, item?: IProjectDataCostsItem) {
    switch (actionType) {
      case 'add-item':
        this.tableDialogRef = this.dialog.open(DataCostsEditDialogComponent, {
          minHeight: '400px',
          minWidth: '400px',
          disableClose: true,
          data: {
            filters: this.filters,
            documentId: this.dataCostsData.dataCosts._id,
          },
        });
        this.tableDialogRef.afterClosed().subscribe((res) => {
          if (res?.event === 'Add Item') {
            this.checkIfDataAndUpdate(res.newTableData);
            this.setPaginator(res.newTableData);
            this.resetSort();
            this.resetFiltersObj();
            this.filters = {
              pageIndex: '0',
              pageSize: this.pageSize.toString(),
            };
            this.dataSource.data = res.newTableData.dataCosts.data;
            this.notificationService.info('The item was added');
          }
        });
        break;
      case 'edit-item':
        this.tableDialogRef = this.dialog.open(DataCostsEditDialogComponent, {
          minHeight: '400px',
          minWidth: '400px',
          disableClose: true,
          data: {
            filters: this.filters,
            documentId: this.dataCostsData.dataCosts._id,
            item: item,
          },
        });
        this.tableDialogRef.afterClosed().subscribe((res) => {
          if (res?.event === 'Edit Item') {
            this.checkIfDataAndUpdate(res.newTableData);
            this.setPaginator(res.newTableData);
            this.dataSource.data = res.newTableData.dataCosts.data;
            this.notificationService.info('The item was edited');
          }
        });
        break;
      default:
        break;
    }
  }

  private confirmAndDelete(dataItemId: string): void {
    this.confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        title: this.translate.instant('MAT_TABLE.DELETE_DIALOG_TITLE'),
        content: this.translate.instant('MAT_TABLE.DELETE_DIALOG_CONTENT'),
      },
    });
    this.confirmDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.removeItem(dataItemId);
      } else {
        this.isLoading = false;
      }
    });
  }

  private checkIfDataAndUpdate(
    dataCostsData: IProjectDataCostsPagination
  ): void {
    if (dataCostsData?.dataCosts?.data[0]) {
      const dataKeys = Object.keys(dataCostsData.dataCosts.data[0]);
      dataKeys.splice(dataKeys.indexOf('id'), 1);
      if (this.selectedProject?.roles.admin === this.currentUser?._id || this.selectedProject?.roles.editor.includes(this.currentUser?._id)) {
        dataKeys.push('id');
      }
      dataKeys.unshift('number');
      this.displayedColumns = dataKeys;
    } else {
      this.displayedColumns = [this.noItemTranslate];
    }
  }

  private searchByValue(): void {
    this.resetSort();
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

  private setPaginator(dataCostsData: any): void {
    this.pageIndex = dataCostsData.pageIndex;
    this.pageSize = dataCostsData.pageSize;
    this.length = dataCostsData.totalItems;
    this.pageSizeOptions = [10, 25, 50];
  }

  private resetSort(): void {
    if (this.sort) {
      this.sort.active = '';
      this.sort.direction = '';
      this.sort._stateChanges.next();
      this.dataSource.sort = this.sort;
      this.currentItemId = this.dataCostsData.dataCosts.itemId;
    }
  }

  private resetFiltersObj(): void {
    this.filters = null;
  }

  private removeItem(dataItemId: string): void {
    this.projectDetailsService
      .deleteProjectItem(
        this.dataCostsData.dataCosts._id,
        dataItemId,
        this.filters
      )
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.checkIfDataAndUpdate(data);
          this.setPaginator(data);
          this.dataSource.data = data.dataCosts.data;
          this.notificationService.info('The item was deleted');
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  ngOnDestroy(): void {
    this.translateSubscription.unsubscribe();
  }
}
