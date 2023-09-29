import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  //PieChart Variables
  chartTitle: string = 'Projects PieChart';
  dataValue: number[] = [11, 12, 13];
  dataLabels: string[] = ['a1', 'b1', 'c1'];
  //End of variables

  projects = [
    { id: 1, title: 'John' },
    { id: 2, title: 'Andrei' },
  ];
  users: UserData[] = [];
  constructor() {}

  ngOnInit(): void {
    // Create 100 users
    for (let i = 1; i <= 100; i++) {
      this.users.push(createNewUser(i));
    }
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
  };
}

/** Constants used to fill up our data base. */
const COLORS = [
  'maroon',
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'purple',
  'fuchsia',
  'lime',
  'teal',
  'aqua',
  'blue',
  'navy',
  'black',
  'gray',
];
const NAMES = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}
