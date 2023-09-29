import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService, LocalStorageService, UserService } from '@services';
import { TokenService } from '@services';
import { NotificationService } from '@services';
import { Router } from '@angular/router';
import { ITokens } from '@interfaces';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    public authService: AuthService,
    private tokenService: TokenService,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService,
    private router: Router,
    private userService: UserService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const tokens: any = this.localStorageService.getItem('tokens');
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${tokens?.accessToken}`,
      },
    });
    return next.handle(request).pipe(
      catchError((error) => {
        // when accessToken is invalid or expired use refresh token
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          error.error.message === 'Invalid Access Token'
        ) {
          return this.tokenService.getRefreshToken(tokens?.refreshToken).pipe(
            switchMap((tokens: ITokens) => {
              this.localStorageService.setItem('tokens', tokens);
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens?.accessToken}`,
                },
              });
              return next.handle(request);
            }),
            catchError((err) => {
              if (
                err instanceof HttpErrorResponse &&
                err.status === 498 &&
                (err.error.error === 'The refresh token has expired' ||
                  err.error.error === 'Access Denied')
              ) {
                this.localStorageService.removeItem('tokens');
                this.localStorageService.removeItem('currentUser');
                this.userService.setLoggedInUser(null);
                this.notificationService.error(
                  err.error.error + '. Please login'
                );
                this.router.navigate(['/login']);
              }
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
