// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
// })
// export class LoginComponent {
//   email: string = '';
//   password: string = '';

//   constructor(private router: Router) {}

//   loginUser() {
//     console.log('Logging in with:', this.email, this.password);
//     this.router.navigate(['/home']); // Redirect to home after login
//   }
// }
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      // Dummy credentials
      const adminCreds = {
        email: 'admin@example.com',
        password: 'adminpassword',
      };
      const userCreds = [
        { email: 'user1@example.com', password: 'user1password' },
        { email: 'user2@example.com', password: 'user2password' },
        { email: 'user3@example.com', password: 'user3password' },
        { email: 'user4@example.com', password: 'user4password' },
        { email: 'user5@example.com', password: 'user5password' },
      ];

      // Check credentials
      if (email === adminCreds.email && password === adminCreds.password) {
        this.simulateLogin();
      } else {
        const foundUser = userCreds.find(
          (user) => user.email === email && user.password === password
        );
        if (foundUser) {
          this.simulateLogin();
        } else {
          this.errorMessage = 'Invalid email or password.';
          this.loading = false;
        }
      }
    }
  }

  simulateLogin() {
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/home']);
    }, 1000);
  }
}
