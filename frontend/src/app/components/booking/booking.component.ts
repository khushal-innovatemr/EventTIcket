import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  paymentIntentId: any;
  isLoading: any;
  Event_Id: any;
  Ticket: any;
  noeventmessage: any;
  bm: any;
  am: any;
  events:any;
  event:any;
  noTaskMessage: any;
  books: any;
  errorMessage: any;
  tickets: any;

  constructor(private router: Router, private eventService: EventService) { }

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
          console.log(this.events);
        }
        this.CurrentBooking(this.Event_Id, this.Ticket);
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  CurrentBooking(Event_Id: string,Ticket: number):void{
    for(let event of this.events){
      console.log('a');
      if (Event_Id === event.Event_id) {
        this.eventService.createPaymentIntent(Event_Id,event.Ticket).subscribe({
          next:(res:any)=>{
            if (res.message) {
              console.log('No Events message:', res.message);
              this.events = [];
              this.noeventmessage = res.message;
            } else {
              this.events = res.data;
              console.log(res);
              this.router.navigate(['/booking']);
            }
            this.paymentIntentId = res.data.paymentIntentId;
            console.log(this.paymentIntentId);
            this.ConfirmBooking(this.Event_Id, this.paymentIntentId);  
          }
          })
        }
    }
  }

  ConfirmBooking(Event_Id: any, paymentIntentId: string): void {
    for (let event of this.events) {
      if (Event_Id === event.Event_id) {
        this.eventService.confirmBooking(this.Event_Id, paymentIntentId).subscribe({
          next: (res: any) => {
            if (res.message) {
              console.log('No Booking Saved', res.message);
              this.bm = [];
              this.noeventmessage = res.message;
            } else {
              this.bm = res.details;
              console.log(res.details)
            }
          }
        });
      }
    }
  }

}  