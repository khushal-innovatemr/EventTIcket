import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  imports:[CommonModule,FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  standalone:true
})
export class BookingComponent implements OnInit {
  paymentIntentId: any;
  isLoading: boolean = false;
  Event_Id: string = '';
  Ticket: number = 0;
  noeventmessage: string = '';
  bm: any;
  am: any;
  events: any[] = [];
  event: any;
  noTaskMessage: string = '';
  books: any;
  errorMessage: string = '';
  tickets: any;

  constructor(private router: Router, private eventService: EventService) {}

  ngOnInit(): void {
    this.SeeEvents();
  }

  SeeEvents(): void {
    this.isLoading = true;
    this.eventService.view_event().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.message) {
          console.log('No Events message:', res.message);
          this.noeventmessage = res.message;
        } else {
          this.events = res.events;
          console.log(this.events);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching events:', err);
      }
    });
  }

  CurrentBooking(Event_Id: string, Ticket: number): void {
    const event = this.events.find(e => e.Event_id === Event_Id);
    if (event) {
      this.eventService.createPaymentIntent(Event_Id, Ticket).subscribe({
        next: (res: any) => {
          if (res.message) {
            console.log('No Events message:', res.message);
            this.am = [];
            this.noeventmessage = res.message;
          } else {
            this.am = res.data;
            console.log(this.am);
            this.paymentIntentId = res.data.paymentIntentId;
            this.ConfirmBooking(Event_Id, this.paymentIntentId);
          }
        },
        error: (err) => {
          console.error('Error creating payment intent:', err);
        }
      });
    }
  }

  ConfirmBooking(Event_Id: string, paymentIntentId: string): void {
    if (Event_Id && paymentIntentId) {
      this.eventService.confirmBooking(Event_Id, paymentIntentId).subscribe({
        next: (res: any) => {
          if (res.message) {
            console.log('No Booking Saved', res.message);
            this.bm = [];
            this.noeventmessage = res.message;
          } else {
            this.bm = res.details;
            console.log(this.bm);
          }
        },
        error: (err) => {
          console.error('Error confirming booking:', err);
        }
      });
    }
  }
}