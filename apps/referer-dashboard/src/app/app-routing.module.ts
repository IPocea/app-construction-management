import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { IdComponent } from './pages/projects/id/id.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { UsersComponent } from './pages/users/users.component';
import { AdminGuard, AuthGuard, NonAuth } from '@shared/guards/index';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./pages/registration/registration.module').then(
        (m) => m.RegistrationModule
      ),
    canActivate: [NonAuth],
    pathMatch: 'full',
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
    canActivate: [NonAuth],
    pathMatch: 'full',
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
    canActivate: [NonAuth],
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
    canActivate: [NonAuth],
    pathMatch: 'full',
  },
  {
    path: 'about',
    component: AboutComponent,
    // canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'dashboard/:menuType/:projectId',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    // canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'projects/:id',
    component: IdComponent,
    // canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'project-invitation',
    loadChildren: () =>
      import('./pages/project-invitation/project-invitation.module').then(
        (m) => m.ProjectInvitationModule
      ),
  },
  {
    path: 'user-invite/:projectId',
    loadChildren: () =>
      import('./pages/user-invite/user-invite.module').then(
        (m) => m.UserInviteModule
      ),
    canActivate: [AuthGuard, AdminGuard],
  },
  // to do, maybe we can find a way to use localStorage service here to make dashboard
  // param on redirect dynamic and if not then we can use normal window.localStorage
  {
    path: '',
    redirectTo: '/dashboard/dynamic/no-project-selected',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/dashboard/dynamic/no-project-selected',
    pathMatch: 'full',
  },
  {
    path: 'users',
    component: UsersComponent,
    // canActivate: [AuthGuard],
    pathMatch: 'full',
  },
];

export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routingConfiguration), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
