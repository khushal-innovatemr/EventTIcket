import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.css'
})
export class AddEventComponent {
  name = '';
  Event_date: any;
  Event_id: any;
  ticket_price: any;
  venue: any;
  description: any;
  image: File | null = null; // Changed from image_url
  avail_ticket: any;
  successMessage: any = '';
  errorMessage: any;
  type: any;
  imageError: any;
  books: any;
  showEvents: any;
  eve: any;
  noeventmessage: any;

  constructor(private eventService: EventService, private router: Router) { }

  add(): void {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('Event_date', this.Event_date);
    formData.append('ticket_price', this.ticket_price);
    formData.append('venue', this.venue);
    formData.append('description', this.description);
    formData.append('type', this.type);
    formData.append('avail_ticket', this.avail_ticket);

    if (this.image) {
      formData.append('image', this.image);
    }

    this.eventService.Add_event(formData).subscribe({
      next: (v) => {
        console.log('---------------------------------------x', formData);
        console.log(v);
        this.successMessage = 'Event Created!';
        this.router.navigate(['/view']);
        this.resetForm();
      },
      error: (err) => (this.errorMessage = err.error.error)
    });
  }



  resetForm() {
    this.name = '';
    this.description = '';
    this.Event_date = null;
    this.Event_id = '';
    this.ticket_price = '';
    this.venue = '';
    this.type = '';
    this.image = null;
    this.avail_ticket = '';
  }



  fileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.imageError = 'Only JPG, JPEG, or PNG files are allowed.';
        this.image = null;
      } else {
        this.imageError = null;
        this.image = file;
      }
    }
  }

  CreateEvent(): void {
    this.router.navigate(['/event'])
  }

  viewEvents(): void {
    this.router.navigate(['/organise'])
  }

  Dashboard():void{
    this.router.navigate(['/manager'])
  }

  See(): void {
    this.eventService.view_event().subscribe({
      next: (res: any) => {
        this.eve = res.events;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  EventsBooked(): void {
    this.showEvents = !this.showEvents;
    this.See();
  }
}