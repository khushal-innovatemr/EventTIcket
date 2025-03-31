import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-register.component.html',
  styleUrl: './admin-register.component.css'
})
export class AdminRegisterComponent {

name = '';
email:any = '';
password = '';
role = ''; 
errorMessage = '';
successMessage = '';

constructor(private authService: AuthService, private router: Router) {} 

  admin_register(): void {
    this.authService.register(this.name,this.email, this.password,this.role).subscribe({
      next: (v) => {
        console.log(v);
        
        this.successMessage = 'User Created By Admin!';
        
        setTimeout(() => {
          this.successMessage = 'Redirecting to Admin..';
          
          setTimeout(() => {
            this.router.navigate(['/admin']);
          },2000);
          
        },1000);
      },
      error: (err) => (this.errorMessage = err.error.error)
    });
  }
}

