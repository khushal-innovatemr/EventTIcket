import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit {
  events: any = [];
  noeventmessage: string = '';
  noTaskMessage: any;
  selectedEvent: any = null;
  books: any;
  errorMessage: any;
  Ticket: any;
  tickets: any;
  showPopup: boolean = false;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.SeeEvents();
  }

  SeeEvents(): void {
    this.eventService.view_event().subscribe({
      next: (res: any) => {
        this.events = res.events;
        this.filtered_events = [...this.events]
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  // book(eventId: string): void {
  //   for (let event of this.events) {
  //     if (eventId === event.Event_id) {
  //       this.eventService.book_event(eventId, event.Ticket).subscribe({
  //         next: (res: any) => {
  //           if (res.message) {
  //             this.books = [];
  //             this.SeeEvents();
  //             this.Ticket = '';
  //           }
  //           this.router.navigate(['/booking']);
  //         },
  //         error: (err: any) => {
  //           this.errorMessage = err.error.error;
  //         }
  //       });
  //     }
  //   }
  // }

  CurrentBooking(Event_Id: string): void {
    for (let event of this.events) {
      if (Event_Id === event.Event_id) {
        console.log('#####################', Event_Id);
        console.log('$$$$$$$$$$$$$$$$$$$', event.Ticket);

        this.router.navigate(['/booking', Event_Id, event.Ticket]);

      }
    }
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  view_Events() {
    this.router.navigate(['/user-view'])
  }

  filtered_events = [...this.events];
  search_filter = '';

  filter_events() {
    if (this.search_filter) {
      this.filtered_events = this.events.filter((event: any) => event.name.toLowerCase().includes(this.search_filter.toLowerCase()) ||
        event.venue.toLowerCase().includes(this.search_filter.toLowerCase()) ||
        event.type.toLowerCase().includes(this.search_filter.toLowerCase())
      );
    }
    else {
      this.filtered_events = [...this.events];
    }
  }


  openPopup(event: any) {
    this.selectedEvent = event;
  }

  closePopup() {
    this.selectedEvent = null;
  }

  userDashboard(){
    this.router.navigate(['/user'])
  }


}