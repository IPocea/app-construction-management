import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { Router } from '@angular/router';
import {
  IDynamicNestedMenu,
  IMenuData,
  INode,
  IProject,
  ITreeNode,
  IUser,
  TreeFlatNode,
} from '@interfaces';
import { TranslateService } from '@ngx-translate/core';
import {
  DashboardMenuService,
  NotificationService,
} from '@services';
import { AddEditMenuCategoryDialogComponent } from '@shared/components/add-edit-menu-category-dialog/add-edit-menu-category-dialog.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { take } from 'rxjs';

@Component({
  selector: 'referer-me-mat-tree-menu',
  templateUrl: './mat-tree-menu.component.html',
  styleUrls: ['./mat-tree-menu.component.scss'],
})
export class MatTreeMenuComponent implements OnInit {
  @Input() currentUser: IUser;
  @Input() selectedProject: IProject;
  @Input() projectId: string = '';
  @Input() menuData: IMenuData[];
  @Input() menuType: string;
  @Input() tabType: string;
  @Input() dashboardSettingsTabType: string;
  @Input() dynamicMenuData: IDynamicNestedMenu;

  private _transformer = (node: ITreeNode, level: number): INode => {
    return {
      expandable:
        (!!node.children && node.children.length > 0) ||
        node.type === 'container',
      name: node.name,
      id:
        this.menuType === 'static'
          ? node.id
          : this.menuType === 'dynamic'
          ? node._id
          : node.id,
      level: level,
      type: node.type,
      parentId: node.parentId,
      projectId: node.projectId,
      depth: node.depth,
    };
  };

  treeControl = new FlatTreeControl<TreeFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    public dialog: MatDialog,
    private dashboardMenuService: DashboardMenuService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataSource.data = this.menuData;
  }

  ngOnChanges(changes: SimpleChange): void {
    this.dataSource.data = this.menuData;
  }

  hasChild = (_: number, node: TreeFlatNode): boolean => node.expandable;

  openDialog(
    actionType: string,
    type: string,
    parentItem: IDynamicNestedMenu | INode,
    item?: INode
  ): void {
    switch (actionType) {
      case 'add-category-or-task':
        this.dialog
          .open(AddEditMenuCategoryDialogComponent, {
            disableClose: true,
            data: {
              type: type,
              parentItem: parentItem,
            },
          })
          .afterClosed()
          .subscribe((res) => {
            if (res?.event === 'Add Category or Task') {
              this.dataSource.data = res?.nestedMenu?.children;
              this.menuData = res?.nestedMenu?.children;
              this.dynamicMenuData = res?.nestedMenu;
            }
          });
        break;
      case 'edit-category-or-task':
        this.dialog
          .open(AddEditMenuCategoryDialogComponent, {
            disableClose: true,
            data: {
              type: type,
              parentItem: parentItem,
              item: item,
            },
          })
          .afterClosed()
          .subscribe((res) => {
            if (res?.event === 'Edit Category or Task') {
              this.dataSource.data = res?.nestedMenu?.children;
              this.menuData = res?.nestedMenu?.children;
              this.dynamicMenuData = res?.nestedMenu;
            }
          });
        break;
      case 'delete-category-or-task':
        this.confirmAndDelete(item.id as string, type);
        break;
      default:
        break;
    }
  }

  getNodeParams(node: INode): string {
    if (node.name === 'Dashboard') {
      return `/dashboard/${this.menuType}/${this.projectId}/${this.dashboardSettingsTabType}`;
    }
    return `/dashboard/${this.menuType}/${this.projectId}/project-details/${node.id}/${this.tabType}`;
  }

  private confirmAndDelete(menuItemId: string, type: string): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        disableClose: true,
        data: {
          title:
            type === 'container'
              ? this.translate.instant('SHARED.DELETE_CATEGORY.TITLE')
              : this.translate.instant('SHARED.DELETE_TASK.TITLE'),
          content:
            type === 'container'
              ? this.translate.instant('SHARED.DELETE_CATEGORY.CONTENT')
              : this.translate.instant('SHARED.DELETE_TASK.CONTENT'),
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.deleteMenuItem(menuItemId, type);
        }
      });
  }

  private deleteMenuItem(menuItemId: string, type: string): void {
    if (type === 'container') {
      this.deleteCategory(menuItemId);
    } else if (type === 'page') {
      this.deleteTask(menuItemId);
    }
  }

  private deleteCategory(menuItemId: string): void {
    this.dashboardMenuService
      .deleteCategory(menuItemId)
      .pipe(take(1))
      .subscribe({
        next: (nestedMenu) => {
          this.dataSource.data = nestedMenu?.children;
          this.menuData = nestedMenu?.children;
          this.dynamicMenuData = nestedMenu;
          this.router.navigate([
            `/dashboard/${this.menuType}/${
              this.projectId ? this.projectId : 'no-project-selected'
            }/${
              this.dashboardSettingsTabType
                ? this.dashboardSettingsTabType
                : 'settings'
            }`,
          ]);
          this.notificationService.info(
            this.translate.instant('SHARED.DELETE_CATEGORY.SUCCESS')
          );
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private deleteTask(menuItemId: string): void {
    this.dashboardMenuService
      .deleteTask(menuItemId)
      .pipe(take(1))
      .subscribe({
        next: (nestedMenu) => {
          this.dataSource.data = nestedMenu?.children;
          this.menuData = nestedMenu?.children;
          this.dynamicMenuData = nestedMenu;
          this.router.navigate([
            `/dashboard/${this.menuType}/${
              this.projectId ? this.projectId : 'no-project-selected'
            }/${
              this.dashboardSettingsTabType
                ? this.dashboardSettingsTabType
                : 'settings'
            }`,
          ]);
          this.notificationService.info(
            this.translate.instant('SHARED.DELETE_TASK.SUCCESS')
          );
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }
}
