import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent {
  events: any;
  noeventmessage: any;
  name: any;
  tickets:any;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.User_View();
  }

  User_View(): void {
    this.eventService.generateTicket().subscribe({
      next: (res: any) => {
        if (res.message) {
          console.log('No Events message:', res.message);
          this.events = [];
          this.noeventmessage = res.message;
        } else {
          this.events = res.tickets;

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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

}
