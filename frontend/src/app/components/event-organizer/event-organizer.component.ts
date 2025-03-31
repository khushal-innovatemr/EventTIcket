import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-organizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-organizer.component.html',
  styleUrl: './event-organizer.component.css'
})
export class EventOrganizerComponent {
noeventmessage: any;
eve:any;
showEvents: boolean = false;
createEvents:boolean = false;
viewsEvents:boolean = false;

constructor(private eventService: EventService, private router: Router) { }

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