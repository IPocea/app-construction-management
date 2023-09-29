import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class NonAuth implements CanActivate {
  constructor(private router: Router, private localStorageService: LocalStorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const tokens = this.localStorageService.getItem('tokens');
    if (tokens) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
