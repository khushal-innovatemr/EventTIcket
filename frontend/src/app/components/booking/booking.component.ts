import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BookingComponent implements OnInit, OnDestroy {
  paymentIntentId: any;
  isLoading: boolean = false;
  Event_Id: any;
  Ticket: any;
  noeventmessage: any;
  bm: any;
  am: any;
  events: any;
  event: any;
  noTaskMessage: any;
  books: any;
  errorMessage: any;
  tickets: any;
  Event_id: any;
  pathValue: any;
  tic: any;
  urlSubscription: any;
  name: any;
  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;
  cardErrors: any;
  successmessage: any;
  booking_date:any;

  constructor(private router: Router, private eventService: EventService, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.urlSubscription = this.route.url.subscribe(async (segments: UrlSegment[]) => {
      this.pathValue = segments.map(segment => segment.path);
      await this.CurrentBooking(this.pathValue[1], this.pathValue[2]);
    });

    this.stripe = await loadStripe('pk_test_51PRotAP5QxWSWHKecb1cvP4kNFrcWFmuGXfKRtVcUymuoS0X72hRcKbkOlXKlzA2LkeiDMH0y5usc6y5JJPrVAGw00f15HQnwM');
  }

  ngOnDestroy(): void {
    if (this.urlSubscription) {
      this.urlSubscription.unsubscribe();
    }
  }

  async CurrentBooking(Event_Id: string, Ticket: number): Promise<void> {
    this.eventService.createPaymentIntent(Event_Id, Ticket).subscribe({
      next: async (res: any) => {
        this.Event_Id = Event_Id;
        this.events = res.data;
        this.tic = Ticket;
        this.booking_date = Date.now()
        this.paymentIntentId = res.data.paymentIntentId;
        await this.setupStripeElements(res.data.client_secret);
      },
      error: (err) => {
        console.error('Error creating payment intent:', err);
      }
    });
  }

  async setupStripeElements(clientSecret: string): Promise<void> {
    if (!this.stripe) {
      this.cardErrors = 'Stripe has not been initialized.';
      return;
    }

    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');

    this.card.on('change', (event: any) => {
      this.cardErrors = event.error ? event.error.message : '';
    });
  }

  async ConfirmBooking(): Promise<void> {
    this.isLoading = true;

    if (!this.stripe || !this.card) {
      this.cardErrors = 'Stripe or card information is not properly initialized.';
      this.isLoading = false;
      return;
    }

    try {
      const result = await this.stripe.confirmCardPayment(this.events.client_secret, {
        payment_method: { card: this.card }
      });

      if (result.error) {
        this.cardErrors = result.error.message;
      } else if (result.paymentIntent.status === 'succeeded') {
        this.eventService.confirmBooking(this.Event_Id, this.paymentIntentId, this.pathValue[2]).subscribe({
          next: (res: any) => {
            this.successmessage = '✅ Payment Successful! Redirecting...';
            setTimeout(() => {
              this.successmessage = '';
              this.router.navigate(['/user-view']);
            }, 3000);
          },
          error: (err) => {
            console.error('Error confirming booking:', err);
          }
        });
      }
    } catch (err: any) {
      console.error('Error processing payment:', err);
      this.cardErrors = 'Payment failed. Please try again.';
    } finally {
      this.isLoading = false;
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
