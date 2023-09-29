import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRightSideComponent } from './dashboard-right-side.component';

const routes: Routes = [{ path: '', component: DashboardRightSideComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRightSideRoutingModule {}
