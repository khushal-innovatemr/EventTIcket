import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent { 
  name = '';
  email:any = '';
  password = '';
  role = ''; 
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.authService.register(this.name,this.email, this.password,this.role).subscribe({
      next: (v) => {
        console.log(v);
        
        this.successMessage = 'User Created!';
        
        setTimeout(() => {
          this.successMessage = 'Redirecting to Login..';
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          },2000);
          
        },1000);
      },
      error: (err) => (this.errorMessage = err.error.error)
    });
  }
}