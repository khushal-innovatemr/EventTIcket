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
  books: any;
  errorMessage: any;
  Ticket: any;
  tickets: any;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.SeeEvents();
  }

  SeeEvents(): void {
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

  CurrentBooking(Event_Id: string):void{
    for(let event of this.events){
      console.log('a');
      if (Event_Id === event.Event_id) {
        console.log('#####################',Event_Id);
        console.log('$$$$$$$$$$$$$$$$$$$',event.Ticket);
        
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

}