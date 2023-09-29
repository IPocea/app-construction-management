import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string | Date, arg: string = 'short'): string {
    let today = new Date(value);
    let day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    let month =
      today.getMonth() + 1 < 10
        ? '0' + (today.getMonth() + 1)
        : today.getMonth() + 1;
    let year = today.getFullYear();
    let hour =
      today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
    let minutes =
      today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    switch (arg) {
      case 'short':
        return `${day}-${month}-${year}`;
      case 'long':
        return `${day}-${month}-${year}, ${hour}:${minutes}`;
      default:
        return `${day}-${month}-${year}`;
    }
    // if (arg === 'long') {
    //   return `${day}-${month}-${year}, ${hour}:${minutes}`;
    // } else {
    //   return `${day}-${month}-${year}`;
    // }
  }
}
