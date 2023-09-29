import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageService, ProjectIdBehaviorService } from '@services';
import { checkMenuData } from '@utils/menu-data';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnumMenuGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private projectIdBehaviorService: ProjectIdBehaviorService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      checkMenuData(
        route.params['category'],
        route.params['subcategory'],
        route.params['subcategoryTwo']
      )
    ) {
      return true;
    } else {
      this.router.navigate([
        '/dashboard',
        this.localStorageService.getItem('menuType')
          ? (this.localStorageService.getItem('menuType') as string)
          : environment.baseMenuType,
        this.projectIdBehaviorService.getProjectId(),
      ]);
      return false;
    }
  }
}
