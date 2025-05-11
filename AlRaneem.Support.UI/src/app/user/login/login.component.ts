import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../../../../src/app/demo-material-module';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DemoMaterialModule, MatTabsModule, ReactiveFormsModule, NgIf, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post<any>('login', this.loginForm.value).subscribe(
        response => {
          debugger
          if (response.IsSuccess) {
            localStorage.setItem('accessToken', response.Data.accessToken); 
            localStorage.setItem('refreshToken', response.Data.refreshToken);
            const tokenExpiryTime = Date.now() + response.Data.expiresIn * 1000;
            localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());  // Save the token
            // Navigate to a protected route (if any)
            this.router.navigate(['/tickets']);
          } else {
            console.error('Login failed', response.Errors);
          }
        },
        error => {
          console.error('An error occurred', error);
        }
      );
    }
  }
}
