import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRightSideComponent } from './dashboard-right-side.component';
import { DashboardRightSideRoutingModule } from './dashboard-right-side-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/modules/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [DashboardRightSideComponent],
  imports: [
    CommonModule,
    DashboardRightSideRoutingModule,
    MatProgressBarModule,
    TranslateModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class DashboardRightSideModule {}
