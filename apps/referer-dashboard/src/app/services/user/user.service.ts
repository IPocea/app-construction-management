import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { IUser } from '@interfaces';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject: Subject<IUser> = new Subject<IUser>();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    // this.userSubject = new Subject<IUser>();
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('https://jsonplaceholder.typicode.com/users');
  }

  createAccount(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(environment.baseUrl + 'registration', user);
  }

  getProfile(): Observable<IUser> {
    return this.http.get<IUser>(environment.baseUrl + 'profile');
  }

  getCurrentUser(): IUser {
    return this.localStorageService.getItem('currentUser') as IUser;
  }
  addCurrentUser(user: IUser) {
    this.localStorageService.setItem('currentUser', user);
    this.userSubject.next(user);
  }

  getLoggedInUser(): Observable<IUser> {
    return this.userSubject.asObservable();
  }

  setLoggedInUser(user: IUser): void {
    this.userSubject.next(user);
  }
}
