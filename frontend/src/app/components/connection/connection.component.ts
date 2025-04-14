import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-connection',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.css'
})
export class ConnectionComponent implements OnInit, OnDestroy {
  private messageSubscription!: Subscription;
  messageData: { sender: string, text: string, role:string }[] = [];
  newMessage: string = '';
  names: string = ''; 
  roles:string = ''
  eve: any;
  chat_data: any;

  constructor(
    private socket: SocketService,
    private eventService: EventService,
    private authService:AuthService
  ) {}

  ngOnInit() {
    this.See();
    this.chats();

    this.messageSubscription = this.socket.on('message').subscribe((data) => {
      console.log("Received from socket:", data);
      console.log(data.text);
      this.messageData.push(data); 
      if(data.text === 'disconnect'){
        console.log('you have disconnected the chat please login again to connect')
        this.authService.logout();
      }
      localStorage.setItem('messages', JSON.stringify(this.messageData));
    });
  }

  sendMessage() {
      const data = {
        sender: this.names,
        text: this.newMessage,
        role:this.roles,
      };
      this.socket.emit('message', data);
      this.newMessage = '';
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe(); 
    }
  }

  See(): void {
    this.eventService.view_event().subscribe({
      next: (res: any) => {
        this.names = res.name; 
        this.roles = res.role;

        // console.log("Sender Name:", this.names,this.roles);
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

  chats():void{
    this.eventService.chatData().subscribe({
      next:(res:any) => {
        this.chat_data = res.data;
      }
    })
  }
}
