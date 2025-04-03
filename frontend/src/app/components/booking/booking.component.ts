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
        // const Event_Id = this.events.Event_Id;
        // const Ticket = this.events.Ticket;
        this.CurrentBooking();
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  CurrentBooking():void{
    for(let event of this.events){
      console.log('a1111111111111111111');
        this.eventService.createPaymentIntent(event.Event_id,event.Ticket).subscribe({
          next:(res:any)=>{
              this.events = res.data;
              console.log('##################################',res);
              this.router.navigate(['/booking']);
            }
          })
        // }
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