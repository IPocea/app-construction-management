import { Component, OnInit } from '@angular/core';
import { UserService } from '@services';
import { take } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private userService: UserService) {}
  ngOnInit() {}
}
