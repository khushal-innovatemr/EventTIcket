import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.css'
})
export class AdminViewComponent {
  events: any = [];
  noeventmessage: string = '';
  noTaskMessage: any;
  books: any;
  errorMessage: any;
  Ticket: any;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.Admin_View();
  }
 
  Admin_View(): void {
    this.eventService.admin_view().subscribe({
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

formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

}

