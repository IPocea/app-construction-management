import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'wordSeparator',
})
export class WordSeparatorPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}
  transform(value: string): string {
    const pattern = /[A-Z]/g;
    let newValue: string;
    if (pattern.test(value)) {
      newValue = value.split(/(?=[A-Z])/).join(' ');
      newValue = newValue.slice(0, 1).toUpperCase() + newValue.slice(1);
    } else {
      newValue = value.slice(0, 1).toUpperCase() + value.slice(1).toLowerCase();
    }
    switch (newValue) {
      case 'Number':
        return this.translate.instant('DASHBOARD_TABLE_FORM.NUMBER');
      case 'Name':
        return this.translate.instant('DASHBOARD_TABLE_FORM.NAME');
      case 'Measurement Unit':
        return this.translate.instant('DASHBOARD_TABLE_FORM.MEASUREMENT_UNIT');
      case 'Quantity':
        return this.translate.instant('DASHBOARD_TABLE_FORM.QUANTITY');
      case 'Unit Price':
        return this.translate.instant('DASHBOARD_TABLE_FORM.UNIT_PRICE');
      case 'Value':
        return this.translate.instant('DASHBOARD_TABLE_FORM.VALUE');
      case 'Created At':
        return this.translate.instant('DASHBOARD_TABLE_FORM.CREATED_AT');
      case 'Updated At':
        return this.translate.instant('DASHBOARD_TABLE_FORM.UPDATED_AT');
      case 'Mentiones':
        return this.translate.instant('DASHBOARD_TABLE_FORM.MENTIONES');
      default:
        return newValue;
    }
  }
}
