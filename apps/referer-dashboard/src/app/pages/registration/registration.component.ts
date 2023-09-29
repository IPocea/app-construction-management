import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ConfirmedValidator } from '@shared/custom-validators/confirmed.validator';
import { finalize, take } from 'rxjs/operators';
import {
  LocalStorageService,
  ProjectIdBehaviorService,
  ProjectInviteService,
  UserService,
} from '@services';
import { NotificationService } from '@services';
import { ActivatedRoute, Router } from '@angular/router';
import { IInvitationParams, ITokens, IUser } from '@interfaces';
import { getPasswordToolTip, cleanForm } from '@utils/form-group';
import { emailRegExp, passwordRegExp } from '@utils/regexp';
import { Subscription } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
  selector: 'referer-me-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective)
  createAccountFormDirective: FormGroupDirective;
  isPasswordHidden: boolean = true;
  isAdding: boolean = false;
  createAccountForm: FormGroup;
  emailPattern: RegExp = emailRegExp();
  passwordPattern: RegExp = passwordRegExp();
  passwordToolTip: string = getPasswordToolTip();
  invitationQueryParams: IInvitationParams = null;
  queryParamsSubscription: Subscription;
  tempUser: IUser = null;
  newUser: IUser = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectInviteService: ProjectInviteService,
    private localStorageService: LocalStorageService,
    private projectIdBehaviorService: ProjectIdBehaviorService,
  ) {}

  ngOnInit(): void {
    this.createAccountForm = this.fb.group(
      {
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        email: [
          null,
          [Validators.required, Validators.pattern(this.emailPattern)],
        ],
        website: [null],
        password: [
          null,
          [Validators.required, Validators.pattern(this.passwordPattern)],
        ],
        confirmPassword: [null, [Validators.required]],
      },
      {
        validators: ConfirmedValidator('password', 'confirmPassword'),
      }
    );
    this.getQueryParams();
  }

  createAccount(): void {
    this.isAdding = true;
    this.createUser();
  }

  // get form controls in order to check if confirmed password is the same with password
  // with the help of a custom validator
  get f(): FormGroup['controls'] {
    return this.createAccountForm.controls;
  }

  private createUser(): void {
    cleanForm(this.createAccountForm);
    this.userService
      .createAccount(this.createAccountForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.isAdding = false;
        })
      )
      .subscribe({
        next: (user: IUser) => {
          this.createAccountFormDirective.resetForm();
          this.notificationService.info('The account was created successfully');
          if (this.tempUser.isTemporary) {
            this.newUser = user;
            this.deleteTempUser();
          } else {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }

  private getQueryParams(): void {
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(
      (qParams) => {
        if (qParams['userId'] && qParams['token'] && qParams['projectId']) {
          this.invitationQueryParams = {
            userId: qParams['userId'],
            token: qParams['token'],
            projectId: qParams['projectId'],
          };
          this.findTemporaryUser();
        }
      }
    );
  }

  private findTemporaryUser(): void {
    this.isAdding = true;
    this.projectInviteService
      .findTempUser(
        this.invitationQueryParams.token,
        this.invitationQueryParams.userId
      )
      .pipe(
        take(1),
        finalize(() => {
          this.isAdding = false;
        })
      )
      .subscribe({
        next: (data: IUser) => {
          this.tempUser = data;
        },
        error: (err) => {},
      });
  }

  private deleteTempUser(): void {
    this.isAdding = true;
    this.projectInviteService
      .deleteTempUser(
        this.invitationQueryParams.token,
        this.invitationQueryParams.userId
      )
      .pipe(
        take(1),
        finalize(() => {
          this.addNewUserRoleToTheProject();
        })
      )
      .subscribe({
        next: (data: { message: string }) => {},
        error: (err) => {
          this.isAdding = false;
        },
      });
  }

  private addNewUserRoleToTheProject(): void {
    this.projectInviteService
      .addUserRoleToProject(
        this.invitationQueryParams.token,
        this.invitationQueryParams.projectId,
        this.tempUser.roleType,
        this.newUser._id
      )
      .pipe(
        take(1),
        finalize(() => {
          this.login();
        })
      )
      .subscribe({
        next: (data: { message: string }) => {},
        error: (err) => {
          this.isAdding = false;
        },
      });
  }

  private login(): void {
    this.projectInviteService
      .loginByEmail(this.invitationQueryParams.token, this.newUser)
      .pipe(take(1))
      .subscribe({
        next: (tokens: ITokens) => {
          this.localStorageService.setItem('tokens', tokens);
          this.projectIdBehaviorService.setNextProjectId(
            this.invitationQueryParams.projectId
          );
          this.userService.addCurrentUser(this.newUser);
          this.destoryInviteToken();
        },
        error: (err) => {
          this.isAdding = false;
          this.notificationService.error(
            err.error.message +
              '. Please ask the project admin for an invitation'
          );
          this.localStorageService.removeItem('tokens');
          this.router.navigate(['/login']);
        },
      });
  }

  private destoryInviteToken(): void {
    this.projectInviteService
      .destroyInviteToken(this.invitationQueryParams.token, this.tempUser._id)
      .pipe(
        take(1),
        finalize(() => {
          const menuType = this.localStorageService.getItem('menuType')
            ? (this.localStorageService.getItem('menuType') as string)
            : environment.baseMenuType;
          this.isAdding = false;
          this.router.navigate([
            '/dashboard',
            menuType,
            this.invitationQueryParams.projectId,
          ]);
        })
      )
      .subscribe({
        next: (data) => {},
        error: (err) => {},
      });
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
  }
}
