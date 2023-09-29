import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './../assets/i18n/', '.json');
}

const translationOptions = {
  loader: {
    provide: TranslateLoader,
    useFactory: (createTranslateLoader),
    deps: [HttpClient]
  }
};

@NgModule({
  imports: [HttpClientModule, TranslateModule.forChild(translationOptions)],
  exports: [TranslateModule],
  providers: [TranslateService]
})
export class AppTranslationLazyModule { }
