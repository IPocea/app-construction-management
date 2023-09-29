import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  private compStyle = new Subject<any>();

  setComputedStyle(): void {
    this.compStyle.next(
      window.getComputedStyle(document.querySelector('body'))
    );
  }

  getComputedStyle(): Observable<any> {
    return this.compStyle.asObservable();
  }

  constructor() {}
}
