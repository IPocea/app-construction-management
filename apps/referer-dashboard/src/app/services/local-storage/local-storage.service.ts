import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(item: string): object | string {
    const storage: object = JSON.parse(localStorage.getItem('projectsApp')) || {};
    return storage[item];
  };
  
  setItem(item: string, newValue: object | string): void {
    const storage: object = JSON.parse(localStorage.getItem('projectsApp')) || {};
    storage[item] = newValue;
    const newStorage: string = JSON.stringify(storage);
    localStorage.setItem('projectsApp', newStorage);
  };
  
  removeItem(item: string): void {
    const storage: object = JSON.parse(localStorage.getItem('projectsApp')) || {};
    delete storage[item];
    const newStorage: string = JSON.stringify(storage);
    localStorage.setItem('projectsApp', newStorage);
  };
}
