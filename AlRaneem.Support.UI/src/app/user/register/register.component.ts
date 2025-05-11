import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DemoMaterialModule } from '../../../app/demo-material-module';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [DemoMaterialModule, MatTabsModule, ReactiveFormsModule, NgIf, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  registerForm: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post('register', this.registerForm.value).subscribe(
        response => {
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Registration failed', error);
        }
      );
    }
  }
}
