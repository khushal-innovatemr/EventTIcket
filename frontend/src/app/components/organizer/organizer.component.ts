import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer.component.html',
  styleUrl: './organizer.component.css'
})
export class OrganizerComponent {
events: any; 
  noeventmessage: any;
  showEvents: any;
  eve: any;

constructor(private eventService: EventService, private router: Router) { }

ngOnInit():void{
  this.OrganizerView();
}

OrganizerView():void{
  this.eventService.organize_view().subscribe({
    next: (res: any) => {
      if (res.message) {
        console.log('No Events message:', res.message);
        this.events = [];
        this.noeventmessage = res.message;
      } else {
        this.events = res;
        console.log(res);

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


CreateEvent():void{
  this.router.navigate(['/event'])
}

viewEvents():void{
  this.router.navigate(['/organise'])
}

See(): void {
  this.eventService.view_event().subscribe({
      next: (res: any) => {
          if (res.message) {
              console.log('No Events message:', res.message);
              this.eve = [];
              this.noeventmessage = res.message;
          } else {
              console.log(res.events);
              this.eve = res.events;
             
          }
      },
      error: (err) => {
          console.error('Error fetching events:', err);
      }
  });
}

EventsBooked(): void {
  this.showEvents = !this.showEvents; // Toggle visibility
    this.See();
}
}

