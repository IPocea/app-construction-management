import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { AboutComponent } from './pages/about/about.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { IdComponent } from './pages/projects/id/id.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
  TranslateParser,
} from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from './shared/modules/shared.module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RequestInterceptor } from './interceptors/request/request.interceptor';
import { UsersComponent } from './pages/users/users.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './services/auth/auth.service';
import { AppTranslationMainModule } from './app-translation-main.module';
import { HttpLoaderFactory } from './custom-translate-loader';
import { MatNativeDateModule } from '@angular/material/core';
import { NonAuth, AuthGuard, AdminGuard } from '@shared/guards';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ProjectsComponent,
    IdComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatButtonModule,
    BrowserAnimationsModule,
    AppTranslationMainModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatNativeDateModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    SharedModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    AuthService,
    AuthGuard,
    NonAuth,
    AdminGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
