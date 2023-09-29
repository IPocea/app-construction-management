import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInviteComponent } from './user-invite.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserInviteRoutingModule } from './user-invite-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [UserInviteComponent],
  imports: [
    CommonModule,
    UserInviteRoutingModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatSelectModule,
  ],
})
export class UserInviteModule {}
