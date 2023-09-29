import { Component, OnInit } from '@angular/core';
import { IUserTestModel } from '@interfaces';
import { UserService } from '@services';

@Component({
  selector: 'referer-me-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: IUserTestModel[] = [];
  userById: IUserTestModel = {
    name: '',
    username: '',
    email: '',
    id: 0,
  };
  constructor(private userServ: UserService) {}

  getUsers(): void {
    this.userServ.getUsers().subscribe({
      next: (data: IUserTestModel[]) => {
        this.users = data;
      },
      error: (err) => {
        console.log('Unable to get data from URL' + err);
      },
    });
  }

  ngOnInit(): void {}
}
