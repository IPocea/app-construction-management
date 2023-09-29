import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardSettingsRoutingModule } from './dashboard-settings-routing.module';
import { DashboardSettingsComponent } from './dashboard-settings.component';
import { SharedModule } from '@shared/modules/shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    DashboardSettingsComponent
  ],
  imports: [
    CommonModule,
    DashboardSettingsRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class DashboardSettingsModule { }
