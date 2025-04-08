import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';
  isSuccess = false;
  token: string | null = null;
  errorMessage = '';
  showTokenMessage = false;
  showRedirectMessage = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.token = res.token;  
        localStorage.setItem('token', res.token);

        this.showTokenMessage = true;
        this.message = 'Token Verified!!';
        this.isSuccess = true;

        if (res.role === 'admin') {
          this.message = 'Redirecting to Admin Dashboard';
          this.router.navigate(['/admin']);
          return;
        } else if (res.role === 'organizer') {
          this.message = 'Redirecting to Organizer View';
          this.router.navigate(['/manager']);
          return;
        }

        this.showRedirectMessage = true;
        this.message = 'Redirecting to Dashboard...';
        this.router.navigate(['/user']);
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      }
    });
  }

  public signInWithGoogle(): void {
    this.authService.signInWithGoogle().subscribe(user => {
      if (user) {
        this.message = 'Google Sign-In Successful!';
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Google Sign-In Failed!';
      }
    });
  }
}