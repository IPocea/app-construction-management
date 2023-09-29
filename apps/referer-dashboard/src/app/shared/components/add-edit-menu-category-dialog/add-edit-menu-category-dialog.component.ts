import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDynamicMenu, IDynamicNestedMenu, INode } from '@interfaces';
import { TranslateService } from '@ngx-translate/core';
import { DashboardMenuService, NotificationService } from '@services';
import { cleanForm } from '@utils/form-group';
import { take } from 'rxjs';

@Component({
  selector: 'referer-me-add-edit-menu-category-dialog',
  templateUrl: './add-edit-menu-category-dialog.component.html',
  styleUrls: ['./add-edit-menu-category-dialog.component.scss'],
})
export class AddEditMenuCategoryDialogComponent implements OnInit {
  createOrEditMenuItem: FormGroup;
  selectedItem: INode = null;
  parentItem: IDynamicNestedMenu | INode = null;
  itemType: string = '';
  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditMenuCategoryDialogComponent>,
    private formProject: FormBuilder,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private dashboardMenuService: DashboardMenuService
  ) {}

  ngOnInit(): void {
    this.selectedItem = this.data?.item; // be carefull, here the item is in fact
    // a node - INode
    this.parentItem = this.data?.parentItem;
    this.itemType = this.data?.type;
    if (this.selectedItem) {
      this.createOrEditMenuItem = this.formProject.group({
        name: [this.selectedItem.name, [Validators.required]],
      });
    } else {
      this.createOrEditMenuItem = this.formProject.group({
        name: [null, [Validators.required]],
        parentId: [
          this.parentItem.parentId
            ? (this.parentItem as INode).id
            : (this.parentItem as IDynamicNestedMenu)._id,
          [Validators.required],
        ],
        projectId: [this.parentItem.projectId, [Validators.required]],
        type: [this.itemType, [Validators.required]],
        depth: [this.parentItem.depth + 1, [Validators.required]],
      });
    }
  }

  public addOrEditMenuItem(ev: any): void {
    ev.preventDefault();
    this.isLoading = true;
    cleanForm(this.createOrEditMenuItem);
    if (this.selectedItem) {
      this.editCategoryOrTask();
    } else {
      this.addCategoryOrTask();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private addCategoryOrTask(): void {
    this.dashboardMenuService
      .addDynamicMenuItem(
        this.parentItem.projectId,
        this.createOrEditMenuItem.value
      )
      .pipe(take(1))
      .subscribe({
        next: (nestedMenu) => {
          this.notificationService.info(
            this.itemType === 'container'
              ? this.translate.instant('SHARED.NEW_CATEGORY.SUCCESS')
              : this.itemType === 'page'
              ? this.translate.instant('SHARED.NEW_TASK.SUCCESS')
              : ''
          );
          this.dialogRef.close({
            event: 'Add Category or Task',
            nestedMenu: nestedMenu,
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.notificationService.error(err.error.message);
        },
      });
  }

  private editCategoryOrTask(): void {
    this.dashboardMenuService
      .editDyanmicMenuItem(
        this.selectedItem?.id as string,
        this.createOrEditMenuItem.value
      )
      .pipe(take(1))
      .subscribe({
        next: (nestedMenu) => {
          this.notificationService.info(
            this.itemType === 'container'
              ? this.translate.instant('SHARED.EDIT_CATEGORY.SUCCESS')
              : this.itemType === 'page'
              ? this.translate.instant('SHARED.EDIT_TASK.SUCCESS')
              : ''
          );
          this.dialogRef.close({
            event: 'Edit Category or Task',
            nestedMenu: nestedMenu,
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.notificationService.error(err.error.message);
        },
      });
  }
}
