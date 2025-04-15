import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  flag: boolean = false;
  tasks: any;
  user: any;
  currentUserId: any;
  showTasks: boolean = false;
  views: any;
  name: any;
  events: any;
  approved: any;
  rejected: any;
  pending: any;
  showRequests: boolean = false;
  noeventmessage: any;
  showEvents: boolean = false;
  eve: any;

  constructor(private authService: AuthService, private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.User_View();
  }

  adminregister(): void {
    this.router.navigate(['/admin-register']);
  }


  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }

  ViewEvents(): void {
    this.router.navigate(['/admin-view']);
  }

  viewchats(){
    this.router.navigate(['/chats'])
  }
  
  CheckUser(): void {
    if (this.flag) {
      this.flag = !this.flag
      this.eventService.getUsers().subscribe({
        next: (res: any) => {
          this.tasks = res;
          console.log('tttttttttttttttttttttttttttttttttttttt', this.tasks);

        },
        error: (error: any) => {
          console.error('Error Fetching Users', error);
        }
      });
    }
    else {
      this.tasks = []
      this.flag = !this.flag
    }
  }

  deleteUser(userId: string): void {
    if (!userId) {
      console.log("sssssssssssssssssssssssssssssssssssss ")
      console.log('No user selected for deletion');
    }
    console.log('Trying to delete user with ID:', userId);
    this.authService.Delete_user(userId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((u: any) => u.userId !== userId);
        console.log('User Deleted Successfully:', this.tasks);
        if (this.currentUserId === userId) {
          this.views = [];
          this.showTasks = false;
          this.currentUserId = '';
        }
      },
      error: (error: any) => {
        console.error('Error Deleting User:', error);
      }
    });
  }

  User_View(): void {
    console.log('111111111111111111111111111111111111111111111111111111111111');
    this.eventService.generateTicket().subscribe({
      next: (res: any) => {
        this.events = res.pendingTickets;
        this.name = res.names;
        console.log('x', res.pendingTickets)
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  AcceptBooking(Ticket_id: string): void {
    if (!Ticket_id) {
      console.log('No Ticket ID provided for approval');
      return;
    }

    console.log('Approving ticket with ID:', Ticket_id);
    this.eventService.Approve_Booking(Ticket_id).subscribe({
      next: (res: any) => {
        this.User_View()
      },
      error: (error: any) => {
        console.error('Approval Failed:', error);
      }
    });
  }

  RejectBooking(Ticket_id: string): void {
    if (!Ticket_id) {
      console.log('No Ticket ID provided for rejection');
      return;
    }

    console.log('Rejecting ticket with ID:', Ticket_id);

    this.eventService.Reject_Booking(Ticket_id).subscribe({
      next: (res: any) => {
        this.User_View()
      },
      error: (error: any) => {
        console.error('Rejection Failed:', error);
      }
    });
  }

  toggleRequests(): void {
    this.flag = !this.flag;
    this.User_View()
  }

  AmountCollection(): void {
    this.router.navigate(['/amount']);
  }

  EventsBooked(): void {
    this.showEvents = !this.showEvents; // Toggle visibility
    this.See();
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


}
