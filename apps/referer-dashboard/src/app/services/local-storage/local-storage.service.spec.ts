import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let store = {};
  const mockLocalStorage = {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ]
    });
    service = TestBed.inject(LocalStorageService);

    spyOn(localStorage, 'getItem')
    .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
    .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
    .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
    .and.callFake(mockLocalStorage.clear);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to set and get an item', () => {
    service.setItem('language', 'ro');
    expect(service.getItem('language')).toEqual('ro');
  });

  it('should be able to remove an item', () => {
    service.setItem('language', 'ro');
    service.removeItem('language');
    expect(service.getItem('language')).toBeFalsy();
  });

});
