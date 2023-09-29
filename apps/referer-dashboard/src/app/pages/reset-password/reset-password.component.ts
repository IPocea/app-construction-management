import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subscription, take } from 'rxjs';
import { NotificationService } from '@services';
import { ResetPasswordService } from '@services';
import { ConfirmedValidator } from '@shared/custom-validators/confirmed.validator';
import { getPasswordToolTip } from '@utils/form-group';
import { passwordRegExp } from '@utils/regexp';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  @ViewChild(FormGroupDirective)
  resetPasswordFormDirective: FormGroupDirective;
  resetPasswordForm: FormGroup;
  passwordPattern: RegExp = passwordRegExp();
  passwordToolTip: string = getPasswordToolTip();
  isAdding: boolean = false;
  isLoading: boolean = false;
  isPasswordHidden: boolean = true;
  email: string = '';
  token: string = '';
  queryParamsSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private resetPasswordService: ResetPasswordService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getParams();

    this.resetPasswordForm = this.fb.group(
      {
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
  }

  resetPassword(): void {
    this.isAdding = true;
    this.resetPasswordAction();
  }

  get f(): FormGroup['controls'] {
    return this.resetPasswordForm.controls;
  }

  private resetPasswordAction(): void {
    this.resetPasswordService
      .resetPassword(this.resetPasswordForm.value.password, this.token)
      .pipe(
        take(1),
        finalize(() => {
          this.isAdding = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.resetPasswordFormDirective.resetForm();
          this.notificationService.info(
            'Your password has been changed successfully'
          );
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.error.statusCode === 406) {
            this.notificationService.error(err.error.message);
          } else {
            this.checkErrorStatusCodeAndRedirect(err);
          }
        },
      });
  }

  // without finalize to not be able to seen this component if no valid token is provided
  private checkToken(): void {
    this.resetPasswordService
      .checkResetToken(this.token)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
        },
        error: (err) => {
          this.checkErrorStatusCodeAndRedirect(err);
        },
      });
  }

  private getParams(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.email = params['email'];
        this.token = params['token'];
        this.checkToken();
      }
    );
  }

  private checkErrorStatusCodeAndRedirect(err): void {
    if (err.error.statusCode === 403) {
      this.notificationService.error(
        'The token is expired. Please ask for a new reset password link'
      );
    } else {
      this.notificationService.error('No valid token was provided');
    }
    this.router.navigate(['/forgot-password']);
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }
}
