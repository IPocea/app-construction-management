import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProject } from '@interfaces';
import { ProjectService } from 'app/services/project/project.service';
import { cleanForm } from '@utils/form-group';
import { finalize, take } from 'rxjs/operators';
import { NotificationService } from '@services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'project-edit.component',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
})
export class ProjectEditDialogComponent implements OnInit {
  createOrEditProjectForm: FormGroup;
  selectedProject: IProject = null;
  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProjectEditDialogComponent>,
    private formProject: FormBuilder,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.selectedProject = this.data?.project;
    if (this.selectedProject) {
      this.createOrEditProjectForm = this.formProject.group({
        name: [this.selectedProject.name, [Validators.required]],
        city: [this.selectedProject.city, [Validators.required]],
        area: [this.selectedProject.area, [Validators.required]],
      });
    } else {
      this.createOrEditProjectForm = this.formProject.group({
        name: [null, [Validators.required]],
        city: [null, [Validators.required]],
        area: [null, [Validators.required]],
      });
    }
  }

  public addOrEditProject(ev: any): void {
    // we need this in order to prevent the dialog from closing on error
    ev.preventDefault();
    this.isLoading = true;
    cleanForm(this.createOrEditProjectForm);
    if (this.selectedProject) {
      this.editProject();
    } else {
      this.addProject();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private addProject(): void {
    this.projectService
      .addProject(this.createOrEditProjectForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (project: IProject) => {
          this.notificationService.info(
            project.name + this.translate.instant('SHARED.NEW_PROJECT.SUCCESS')
          );
          this.dialogRef.close({
            event: 'Add Project',
            project: project,
          });
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private editProject(): void {
    this.selectedProject.name = this.createOrEditProjectForm.value.name;
    this.selectedProject.city = this.createOrEditProjectForm.value.city;
    this.selectedProject.area = this.createOrEditProjectForm.value.area;
    this.projectService
      .editProjectById(this.selectedProject)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (project) => {
          this.notificationService.info(
            project.name + this.translate.instant('SHARED.EDIT_PROJECT.SUCCESS')
          );
          this.dialogRef.close({
            event: 'Edit Project',
            project: project,
          });
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }
}
