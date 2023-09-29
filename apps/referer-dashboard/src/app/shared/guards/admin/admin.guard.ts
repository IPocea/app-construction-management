import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { IProject, IUser } from '@interfaces';
import {
  LocalStorageService,
  ProjectIdBehaviorService,
  ProjectService,
  UserService,
} from '@services';
import { environment } from 'environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkUserAcces(route.params['projectId']);
  }

  checkUserAcces(projectId: string): Observable<boolean> {
    const user: IUser = this.userService.getCurrentUser();
    const menuType: string = this.localStorageService.getItem('menuType')
      ? (this.localStorageService.getItem('menuType') as string)
      : environment.baseMenuType;
    return this.projectService.getOneProject(projectId).pipe(
      map((project: IProject) => {
        if (project?.roles?.admin === user?._id) {
          return true;
        } else {
          this.router.navigate(['/dashboard', menuType, projectId]);
          return false;
        }
      }),
      catchError((err) => {
        this.router.navigate(['/dashboard', menuType, projectId]);
        return throwError(() => err);
      })
    );
  }
}
