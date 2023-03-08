import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models';
import { Observable, tap } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.SERVER_URL;

  constructor(private http: HttpClient) {}

  createNewUser(user: User): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'auth/signup', user);
  }

  login(user: any): Observable<any> {
    return this.http
      .post<any>(this.apiUrl + 'auth/sign-in', user)
      .pipe(tap((res) => this.setSession(res.result)));
  }

  logout(): Observable<any> {
    console.log('api...');
    return this.http
      .get<any>(this.apiUrl + 'auth/logout')
      .pipe(tap((res) => this.deleteCurrentSession()));
  }

  setSession(cognito: any): void {
    try {
      localStorage.setItem(environment.SESSION_NAME, JSON.stringify(cognito));
    } catch (e) {
      //   this.dialog.error(e);
    }
  }

  deleteCurrentSession(): void {
    if (localStorage.getItem(environment.SESSION_NAME)) {
      localStorage.removeItem(environment.SESSION_NAME);
    }
  }

  getCurrentSession(): any {
    const session = localStorage.getItem(environment.SESSION_NAME);
    if (session === '[object Object]') {
      this.deleteCurrentSession();
      return;
    }
    if (session) {
      try {
        return JSON.parse(session);
      } catch (e) {
        return null;
      }
    }
  }

  getUserToken(): any {
    const token = this.getCurrentSession();
    if (!token) return null;
    const payload: any = jwt_decode(token.token);
    const username: string = payload['username'];
    const publicKeyBase64: string = payload['publicKeyBase64'];
    const privateKeyBase64: string = payload['privateKeyBase64'];

    if (!username || !publicKeyBase64 || !privateKeyBase64) {
      return null;
    }
    const userToken: any = {
      username: username,
      publicKeyBase64: publicKeyBase64,
      privateKeyBase64: privateKeyBase64,
    };
    return userToken;
  }
}
