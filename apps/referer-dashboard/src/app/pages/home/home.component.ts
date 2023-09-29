import { Component, OnInit } from '@angular/core';
import { UserService } from '@services';

import { take } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  data: any;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService
      .getProfile()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          //  Write this into the localStorage with the name 'currentUser'
          this.data = data;
          this.userService.addCurrentUser(data);
        },
        error: (err) => {},
      });
  }
}
