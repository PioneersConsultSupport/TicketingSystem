import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  setToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout() {
    this.clearToken();
    return this.http.post<any>(`${environment.apiUrl}/auth/logout`, null);
  }

  clearToken() {
    localStorage.removeItem('jwt_token');
  }
}
