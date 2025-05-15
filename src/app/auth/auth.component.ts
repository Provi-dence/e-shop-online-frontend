import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true; // Toggle between login and register
  loginForm = { email: '', password: '' };
  registerForm = { username: '', email: '', password: '' };

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onLoginSubmit() {
    if (this.loginForm.email && this.loginForm.password) {
      console.log('Login submitted:', this.loginForm);
      // Add your authentication service call here
    }
  }

  onRegisterSubmit() {
    if (this.registerForm.username && this.registerForm.email && this.registerForm.password) {
      console.log('Register submitted:', this.registerForm);
      // Add your registration service call here
    }
  }
}
