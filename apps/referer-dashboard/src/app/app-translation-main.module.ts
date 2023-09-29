import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { environment } from 'environments/environment';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './../assets/i18n/', '.json');
}

const translationOptions = {
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient]
  }
};

@NgModule({
  imports: [HttpClientModule, TranslateModule.forRoot(translationOptions)],
  exports: [TranslateModule],
  providers: [TranslateService]
})
export class AppTranslationMainModule {
  constructor(private translate: TranslateService,
              private lsService: LocalStorageService) {

    const currentLang = this.lsService.getItem('language') as string || 'ro';
    
    this.translate.addLangs(environment.languages);
    this.translate.setDefaultLang(currentLang);
    this.translate.use(currentLang);
  }
}
