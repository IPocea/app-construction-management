import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserInviteBehaviorService {
  isUserInviteRouteActive: boolean = false;
  userInviteRouteStatus: BehaviorSubject<boolean>;

  constructor() {
    this.userInviteRouteStatus = new BehaviorSubject(
      this.isUserInviteRouteActive
    );
  }

  setNextStatus(isUserInviteRouteActive: boolean): void {
    this.userInviteRouteStatus.next(isUserInviteRouteActive);
  }

  getStatus(): boolean {
    return this.userInviteRouteStatus.value;
  }
}
