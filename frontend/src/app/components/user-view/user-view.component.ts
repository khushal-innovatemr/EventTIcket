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
  tickets: any;
  curr_Ticket_id: any;
  views: any;
  showTasks: boolean = false;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.User_View();
  }

  User_View(): void {
    this.eventService.generateTicket().subscribe({
      next: (res: any) => {
        this.events = res.tickets;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  cancel_ticket(Ticket_id: string): void {
    if (!Ticket_id) {
      console.log('No Booking selected for deletion');
      return;
    }
    console.log('Trying to delete user with ID:', Ticket_id);
    this.eventService.Cancel_Ticket(Ticket_id).subscribe({
      next: () => {
        console.log('Booking Deleted Successfully:', Ticket_id);
        if (this.curr_Ticket_id === Ticket_id) {
          this.views = [];
          this.showTasks = false;
          this.curr_Ticket_id = '';
        }
        this.User_View();
      },
      error: (error: any) => {
        console.error('Error Deleting User:', error);
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

  viewEvents(): void {
    this.router.navigate(['/view'])
  }

  userDashboard(){
    this.router.navigate(['/user'])
  }
}
