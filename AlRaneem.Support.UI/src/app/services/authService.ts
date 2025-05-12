import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();

    // Navigate to login or home page
    this.router.navigate(['/user/login']);
  }

  // Check if user is logged in (example implementation)
  isLoggedIn(): boolean {
    let userToken = JSON.parse(localStorage.getItem('user') ?? '').token;
    return !!userToken;
  }
}
