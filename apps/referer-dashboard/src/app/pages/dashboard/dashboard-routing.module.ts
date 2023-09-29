import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@shared/guards';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: ':tabType',
        loadChildren: () =>
          import('../dashboard-settings/dashboard-settings.module').then(
            (m) => m.DashboardSettingsModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'project-details/:itemId/:tabType',
        loadChildren: () =>
          import('../dashboard-right-side/dashboard-right-side.module').then(
            (m) => m.DashboardRightSideModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
