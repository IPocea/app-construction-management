import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ITokens } from '@interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private http: HttpClient;
  constructor(private handler: HttpBackend) {
    this.http = new HttpClient(this.handler);
  }

  getRefreshToken(refreshToken: string): Observable<ITokens> {
    return this.http.get<ITokens>(environment.baseUrl + 'auth/refresh', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      }),
    });
  }
}
