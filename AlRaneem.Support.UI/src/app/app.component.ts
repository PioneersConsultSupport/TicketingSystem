import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router) { }

  title(title: any) {
    throw new Error('Method not implemented.');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');  // Check if token exists
  }

  // Method to log the user out
  logout() {
    localStorage.removeItem('accessToken');  // Remove the token
    this.router.navigate(['/login']);  // Navigate back to login page
  }
  
}
