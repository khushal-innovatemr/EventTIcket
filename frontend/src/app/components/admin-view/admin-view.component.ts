import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule,FormsModule],
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
  showTasks:boolean = false;
  views:any;
  currentEventId:any;

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
                this.filtered_events = [...this.events]

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

delete_event(Event_id: string): void {
  if (!Event_id) {
      console.log("sssssssssssssssssssssssssssssssssssss ")
      console.log('No Event selected for deletion');
  }
  console.log('Trying to delete user with ID:', Event_id);
  this.eventService.Delete_event(Event_id).subscribe({
      next: () => {
        console.log(this.events)
        this.events = this.events.filter((u: any) => u.Event_id !== Event_id);
        console.log('User Deleted Successfully:', this.events );
          if (this.currentEventId === Event_id) {
              this.views = [];
              this.showTasks = false;
              this.currentEventId = '';
            }
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


filtered_events = [...this.events];
search_filter = '';

filter_events(){
  if(this.search_filter){
    this.filtered_events = this.events.filter( (event:any) => event.name.toLowerCase().includes(this.search_filter.toLowerCase()) ||
    event.venue.toLowerCase().includes(this.search_filter.toLowerCase())
  );
}
  else{
    this.filtered_events = [...this.events];
  }
}

}