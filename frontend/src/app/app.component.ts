import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Event App';
  events: any;
  noeventmessage: any;
  
  constructor(
    private authService:AuthService,
    private eventService:EventService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.ViewEvents();
    } else {
      this.router.navigate(['/login']);
    }
  }

  ViewEvents():void{
    this.eventService.view_event().subscribe({
      next: (res: any) => {
          if (res.message) {
              console.log('No Events message:', res.message);
              this.events = [];
              this.noeventmessage = res.message;
          } else {
              this.events = res.events;

              this.events.forEach((v: any) => {
                // console.log('Event ID:', v.Event_id);
            }); 
          }
      },
      error: (err) => {
          console.error('Error fetching events:', err);
      }
  });
  }
  
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  
  logout(): void {
    this.authService.logout();
  }
}

