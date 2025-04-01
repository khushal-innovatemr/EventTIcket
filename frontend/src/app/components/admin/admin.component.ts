import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  flag: boolean = false;
  tasks: any; 
  user: any;
  currentUserId: any;
  showTasks: boolean = false;
  views: any;

  constructor(private authService: AuthService, private eventService:EventService,private router: Router) {}



  adminregister(): void {
    this.router.navigate(['/admin-register']);
  }


  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  
  logout(): void {
    this.authService.logout();
  }

  ViewEvents():void{
    this.router.navigate(['/admin-view']);
  }

  CheckUser(): void {
    if(this.flag){
      this.flag = !this.flag
      this.eventService.getUsers().subscribe({
        next: (res: any) => {
          this.tasks = res; 
          console.log('tttttttttttttttttttttttttttttttttttttt',this.tasks );
          
      },
        error: (error: any) => {
          console.error('Error Fetching Users', error);
      }
    });
  }
else{
  this.tasks=[]
  this.flag=!this.flag
}}
  
deleteUser(userId: string): void {
  if (!userId) {
      console.log("sssssssssssssssssssssssssssssssssssss ")
      console.log('No user selected for deletion');
  }
  console.log('Trying to delete user with ID:', userId);
  this.authService.Delete_user(userId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((u: any) => u.userId !== userId);
        console.log('User Deleted Successfully:', this.tasks );
          if (this.currentUserId === userId) {
              this.views = [];
              this.showTasks = false;
              this.currentUserId = '';
            }
      },
      error: (error: any) => {
          console.error('Error Deleting User:', error);
      }
  }); 
}

}
