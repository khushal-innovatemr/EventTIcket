import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abc.component.html',
  styleUrl: './abc.component.css'
})
export class AbcComponent {

message:any;

  constructor(private authService:AuthService,private router: Router){}

  ngOnInit():void{
    this.logout();
  }

  logout(): void {
    this.authService.logout();
    console.log('Wrong Route Redirecting to login........')
    setTimeout(() => {
      this.router.navigate(['/login'])
      this.message = 'Redirecting to Admin Dashboard';
    }, 2000);
  }
}
