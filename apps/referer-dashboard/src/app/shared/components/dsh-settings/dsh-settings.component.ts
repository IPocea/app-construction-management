import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService, ProjectIdBehaviorService } from '@services';

@Component({
  selector: 'referer-me-dsh-settings',
  templateUrl: './dsh-settings.component.html',
  styleUrls: ['./dsh-settings.component.scss'],
})
export class DshSettingsComponent implements OnInit {
  @Input() tabType: string;
  isDynamicMenu: boolean;

  constructor(
    private localStorageService: LocalStorageService,
    private projectIdBehaviorService: ProjectIdBehaviorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isDynamicMenu =
      this.localStorageService.getItem('menuType') === 'dynamic' ? true : false;
  }

  toogleMenuType(): void {
    setTimeout(() => {
      this.isDynamicMenu
        ? this.localStorageService.setItem('menuType', 'dynamic')
        : this.localStorageService.setItem('menuType', 'static');
      this.router.navigate([
        '/dashboard',
        this.localStorageService.getItem('menuType') as string,
        this.projectIdBehaviorService.getProjectId(),
        this.tabType,
      ]);
    }, 100);
  }
}
