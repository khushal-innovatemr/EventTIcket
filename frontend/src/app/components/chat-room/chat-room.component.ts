import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { EventService } from '../../services/event.service';
import { ActivatedRoute, Router,UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'] 
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  private messageSubscription!: Subscription;
  messageData: { sender: string; text: string; role: string; senderId: string }[] = [];
  newMessage: string = '';
  name: string = '';
  roomName: string = '';
  names: string = '';
  urlSubscription: any;
  roles: string = '';
  colorMap: { [key: string]: string } = {};
  pathValue: any;
  successMessage: any;
  isButtonClicked: boolean = false;

  constructor(
    private socket: SocketService,
    private eventService: EventService,
    private router: Router,
    private route:ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.urlSubscription = this.route.url.subscribe(async (segments: UrlSegment[]) => {
          this.pathValue = segments.map(segment => segment.path);
          console.log(this.pathValue[1]);
        });

    this.messageSubscription = this.socket.on('message').subscribe((data: any) => {
      console.log('Received from socket:', data);

      if (!this.colorMap[data.senderId]) {
        this.colorMap[data.senderId] = this.generateColor(data.senderId);
      }

      this.messageData.push(data);
      localStorage.setItem('messages', JSON.stringify(this.messageData));
    });
  }

  generateColor(id: string): string {
    const colors = ['black','gray','brown'];
    let hash = 0;

    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }

  sendMessage(): void {
    console.log('newMessage:', this.newMessage);
    console.log('roomName:', this.pathValue?.[1]);
  
    if (!this.newMessage.trim() || !this.pathValue?.[1]?.trim()) {
      console.error('Message or Room Name is empty.');
      return;
    }
  
    if (!this.names.trim()) {
      console.error('Sender name is empty.');
      return;
    }
  
    const data = { roomName: this.pathValue[1], message: this.newMessage, sender: this.names };
    console.log('Sending data:', data);
  
    this.socket.emit('roomMessage', data);
  
    this.newMessage = '';
  }
  saveMessage(): void {
    this.eventService.chatData(this.messageData).subscribe({
      next: (res) => {
        console.log('Chat saved:', res);
        this.messageData = [];
        this.successMessage = 'Chat Ended';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/connection']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error saving chat:', err);
      }
    });
  }

  SendName(): void {
    
    this.names = this.name;
    this.isButtonClicked = true;
    this.name = '';
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.urlSubscription) {
      this.urlSubscription.unsubscribe();
    }
  }

 

  userDashboard(): void {
    this.router.navigate(['/user']);
  }
}


