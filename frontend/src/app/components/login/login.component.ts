declare const google:any
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
const clientID = '1015469568453-jr3b9jqs2ca014ta6h8s0o24l34ocruf.apps.googleusercontent.com';


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
  token: any | null = null;
  errorMessage = '';
  showTokenMessage = false;
  showRedirectMessage = false;
  clientId:any;
  successMessage: any;
  failureMessage: any;
  user:any;
  name:any;
  role:any; 

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(){
    
    google.accounts.id.initialize({
      client_id: '1015469568453-jr3b9jqs2ca014ta6h8s0o24l34ocruf.apps.googleusercontent.com',
      callback: (res: any) => this.handleGoogleLogin(res),
    });

    google.accounts.id.renderButton(
      document.getElementById('g_id_signin'),
      { theme: 'outline', size: 'large' }
    );

  }
  

  handleGoogleLogin(v: any) {
    console.log(v.credential);
      this.authService.googleLogin(v.credential,this.role).subscribe({
        next: (res) => {
          
          res.role = this.role;
          
          localStorage.setItem('token', res.token);
          localStorage.setItem('usedasssssssssssssssssssr', JSON.stringify(res.role));
          
          if (res.role === 'organizer') {
            this.router.navigate(['/manager']);
            this.message = 'Redirecting to Organizer View';
            return;
          }
          else{
            this.showRedirectMessage = true;
            this.message = 'Redirecting to Dashboard...';
            this.router.navigate(['/user']);
            return;
          }
        },
        error: () => alert('Google login failed.'),
      });
    
  }

  


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
}