import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent {
  newMessage: any;
  messages:any = [];
  messafe:any;
  chatss:any;
  chat:any;
  text:any;
  sender:any

  constructor(private event:EventService){}

  ngOnInit(){
    this.fetchChats();
  }

updatechat(){
  this.fetchChats();
}

  fetchChats(): void {  
    this.event.viewChat().subscribe({
      next: (response) => {
        this.chatss = response.view_chats;

        this.chatss.forEach((v: any) => {
          this.messages = v.messages;
      }); 
      },
      error: (error) => {
        console.error('Error fetching chats:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('hi-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}

