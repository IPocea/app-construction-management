import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { ResetPasswordService } from '@services';
import { NotificationService } from '@services';
import { cleanForm } from '@utils/form-group';
import { emailRegExp } from '@utils/regexp';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild(FormGroupDirective)
  sendResetLinkFormDirective: FormGroupDirective;
  sendResetLinkForm: FormGroup;
  emailPattern: RegExp = emailRegExp();
  isAdding: boolean = false;

  constructor(
    private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sendResetLinkForm = this.fb.group({
      email: [
        null,
        [Validators.required, Validators.pattern(this.emailPattern)],
      ],
    });
  }

  sendResetLink(): void {
    this.isAdding = true;
    this.sendLink();
  }

  private sendLink(): void {
    cleanForm(this.sendResetLinkForm);
    this.resetPasswordService
      .getResetToken(this.sendResetLinkForm.value.email)
      .pipe(
        take(1),
        finalize(() => {
          this.isAdding = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.sendResetLinkFormDirective.resetForm();
          this.notificationService.info(res.message);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.notificationService.error(err.error.message);
        },
      });
  }
}
