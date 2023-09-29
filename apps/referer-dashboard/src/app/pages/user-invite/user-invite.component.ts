import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IProject, IUser } from '@interfaces';
import { TranslateService } from '@ngx-translate/core';
import {
  LocalStorageService,
  NotificationService,
  ProjectService,
  UserInviteBehaviorService,
  UserService,
} from '@services';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { cleanForm } from '@utils/form-group';
import { emailRegExp } from '@utils/regexp';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'user-invite',
  templateUrl: './user-invite.component.html',
  styleUrls: ['./user-invite.component.scss'],
})
export class UserInviteComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective)
  sendInvitationFormGroupDirective: FormGroupDirective;
  sendInvitationForm: FormGroup;
  emailPattern: RegExp = emailRegExp();
  projectId: string = '';
  project: IProject = null;
  isAdding: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userInviteBehaviorService: UserInviteBehaviorService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.userInviteBehaviorService.setNextStatus(true);
    this.sendInvitationForm = this.fb.group({
      email: [
        null,
        [Validators.required, Validators.pattern(this.emailPattern)],
      ],
      roleType: [null, [Validators.required]],
    });
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['projectId'];
      this.getProfile();
    });
  }

  sendInvitation(ev: Event): void {
    ev.preventDefault();
    this.isAdding = true;
    cleanForm(this.sendInvitationForm);
    this.addToRoleIfUserExists();
  }

  private getProfile(): void {
    this.isAdding = true;
    this.userService
      .getProfile()
      .pipe(
        take(1),
        finalize(() => {
          this.getProject();
        })
      )
      .subscribe({
        next: (data) => {
          this.userService.addCurrentUser(data);
          this.localStorageService.setItem('currentUser', data);
        },
        error: (err) => {
          this.isAdding = false;
        },
      });
  }

  private addToRoleIfUserExists(): void {
    this.projectService
      .addToRoleIfUserExist(
        this.projectId,
        this.sendInvitationForm.value.roleType,
        this.sendInvitationForm.value.email
      )
      .pipe(take(1))
      .subscribe({
        next: (user: IUser) => {
          this.sendInviteEmail();
        },
        error: (err) => {
          if (
            err.error.statusCode === 400 &&
            err.error.message.startsWith('The selected user is already added as')
          ) {
            this.dialog
              .open(ConfirmationDialogComponent, {
                disableClose: true,
                data: {
                  title: this.translate.instant(
                    'USER_INVITE.CONFIRM_DIALOG.TITLE'
                  ),
                  content: this.translate.instant(
                    'USER_INVITE.CONFIRM_DIALOG.CONTENT'
                  ),
                },
              })
              .afterClosed()
              .subscribe((res) => {
                if (res) {
                  this.sendInviteEmail();
                } else {
                  this.isAdding = false;
                }
              });
          } else {
            this.isAdding = false;
          }
        },
      });
  }

  private getProject(): void {
    this.projectService
      .getOneProject(this.projectId)
      .pipe(
        take(1),
        finalize(() => {
          this.isAdding = false;
        })
      )
      .subscribe({
        next: (project: IProject) => {
          this.project = project;
        },
        error: (err) => {},
      });
  }

  private sendInviteEmail(): void {
    this.projectService
      .sendInviteEmail({
        email: this.sendInvitationForm.value.email,
        project: this.project,
        roleType: this.sendInvitationForm.value.roleType,
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isAdding = false;
        })
      )
      .subscribe({
        next: (response: { message: string }) => {
          this.notificationService.info(response.message);
          this.sendInvitationFormGroupDirective.resetForm();
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }
  ngOnDestroy(): void {
    this.userInviteBehaviorService.setNextStatus(false);
  }
}
