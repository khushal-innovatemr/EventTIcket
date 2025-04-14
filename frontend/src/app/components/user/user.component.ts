import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { setEngine } from 'node:crypto';
import { pipe } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  name = '';
  events: any;
  noeventmessage: any;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.See()
  } 

  SeeEvents() {
    this.router.navigate(['/view'])
  }

  SeeBookings() {
    this.router.navigate(['/user-view'])
  }

  SeeConnection(){
    this.router.navigate(['/connection'])
  }
  
  See(): void {
    this.eventService.view_event().subscribe({
      next: (res: any) => {
        this.events = res.events;
        this.name = res.name;
        console.log(this.name);
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

}
