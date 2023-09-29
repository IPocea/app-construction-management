import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import {
  AuthService,
  LocalStorageService,
  NotificationService,
  ProjectIdBehaviorService,
  ProjectService,
} from '@services';
import { getPasswordToolTip, cleanForm } from '@utils/form-group';
import { emailRegExp, passwordRegExp } from '@utils/regexp';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild(FormGroupDirective)
  loginFormDirective: FormGroupDirective;
  loginForm: FormGroup;
  emailPattern: RegExp = emailRegExp();
  passwordPattern: RegExp = passwordRegExp();
  passwordToolTip: string = getPasswordToolTip();
  isLogging: boolean = false;
  isPasswordHidden: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private projectService: ProjectService,
    private projectIdBehaviorService: ProjectIdBehaviorService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [
        null,
        [Validators.required, Validators.pattern(this.emailPattern)],
      ],
      password: [
        null,
        [Validators.required, Validators.pattern(this.passwordPattern)],
      ],
    });
  }

  login(): void {
    this.isLogging = true;
    this.doLogin();
  }

  private doLogin(): void {
    cleanForm(this.loginForm);
    this.authService
      .login(this.loginForm.value)
      .pipe(take(1))
      .subscribe({
        next: (tokens) => {
          this.localStorageService.setItem('tokens', tokens);
          this.getUserProjects();
        },
        error: (err) => {
          this.isLogging = false;
          this.notificationService.error(
            err.error.message || 'An unexpected error has occured'
          );
        },
      });
  }

  private getUserProjects(): void {
    this.projectService
      .getProjects()
      .pipe(
        take(1),
        finalize(() => {
          this.isLogging = false;
        })
      )
      .subscribe({
        next: (projects) => {
          const projectId = projects[0]
            ? projects[0]._id
            : 'no-project-selected';
          this.projectIdBehaviorService.setNextProjectId(projectId);
          this.router.navigate([
            '/dashboard',
            this.localStorageService.getItem('menuType')
              ? (this.localStorageService.getItem('menuType') as string)
              : environment.baseMenuType,
            projectId,
          ]);
        },
        error: (err) => {
          this.notificationService.error(
            'An error has occurred. Please try again'
          );
        },
      });
  }
}
