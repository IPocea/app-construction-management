import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITokens, IUserLoginData } from '@interfaces';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getToken() {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  apiKey: any = 'asdfasdawe';

  setApiKey() {
    localStorage.setItem('apiKey', this.apiKey);
  }

  getAuth() {
    let api;
    this.setApiKey();
    api = localStorage.getItem('apiKey');
    console.log(api);
    return api;
  }

  login(loginData: IUserLoginData): Observable<ITokens> {
    return this.http.post<ITokens>(
      environment.baseUrl + 'auth/login',
      loginData
    );
  }

  logout(): Observable<any> {
    return this.http.get(environment.baseUrl + 'auth/logout');
  }
}
