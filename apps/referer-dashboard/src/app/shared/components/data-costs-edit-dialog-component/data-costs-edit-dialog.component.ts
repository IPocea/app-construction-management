import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { onlyLetters, onlyNumbers } from '@utils/regexp';
import { NotificationService, ProjectDetailsService } from '@services';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import {
  IProjectDataCostsItem,
  IProjectDataCostsPagination,
  IProjectDetailsFilters,
} from '@interfaces';
import { cleanForm } from '@utils/form-group';
import { finalize, take } from 'rxjs';

@Component({
  templateUrl: './data-costs-edit-dialog.component.html',
  styleUrls: ['./data-costs-edit-dialog.component.scss'],
})
export class DataCostsEditDialogComponent implements OnInit {
  numberPattern: RegExp = onlyNumbers();
  lettersPattern: RegExp = onlyLetters();
  isLoading: boolean = false;
  tableDataForm: FormGroup;
  tableDataFormDirective: FormGroupDirective;
  filters: IProjectDetailsFilters = null;
  documentId: string;
  itemToEdit: IProjectDataCostsItem = null;
  newTableData: IProjectDataCostsPagination = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<DataCostsEditDialogComponent>,
    private projectDetailsService: ProjectDetailsService
  ) {}

  ngOnInit(): void {
    this.filters = this.data.filters;
    this.documentId = this.data.documentId;
    this.itemToEdit = this.data?.item ? this.data.item : null;
    if (this.itemToEdit) {
      this.tableDataForm = this.fb.group({
        name: [this.itemToEdit.name, [Validators.required]],
        measurementUnit: [
          this.itemToEdit.measurementUnit,
          [Validators.required],
        ],
        quantity: [
          this.itemToEdit.quantity,
          [Validators.required, Validators.pattern(this.numberPattern)],
        ],
        unitPrice: [
          this.itemToEdit.unitPrice,
          [Validators.required, Validators.pattern(this.numberPattern)],
        ],
        mentiones: [this.itemToEdit.mentiones],
      });
    } else {
      this.tableDataForm = this.fb.group({
        name: [null, [Validators.required]],
        measurementUnit: [
          null,
          [Validators.required],
        ],
        quantity: [null, [Validators.required, Validators.pattern(this.numberPattern)]],
        unitPrice: [
          null,
          [Validators.required, Validators.pattern(this.numberPattern)],
        ],
        mentiones: [''],
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  submit() {
    this.isLoading = true;
    cleanForm(this.tableDataForm);
    if (this.itemToEdit) {
      this.editItem();
    } else {
      this.addItem();
    }
  }

  private addItem(): void {
    this.projectDetailsService
      .addProjectItem(this.documentId, this.filters, this.tableDataForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.newTableData = data;
          this.dialogRef.close({
            event: 'Add Item',
            newTableData: this.newTableData,
          });
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private editItem(): void {
    this.projectDetailsService
      .editProjectItem(
        this.documentId,
        this.itemToEdit.id,
        this.filters,
        this.tableDataForm.value
      )
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.newTableData = data;
          this.dialogRef.close({
            event: 'Edit Item',
            newTableData: this.newTableData,
          });
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }
}
