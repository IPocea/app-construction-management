import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectInvitationRoutingModule } from './project-invitation-routing.module';
import { ProjectInvitationComponent } from './project-invitation.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    ProjectInvitationComponent
  ],
  imports: [
    CommonModule,
    ProjectInvitationRoutingModule,
    MatProgressSpinnerModule
  ]
})
export class ProjectInvitationModule { }
