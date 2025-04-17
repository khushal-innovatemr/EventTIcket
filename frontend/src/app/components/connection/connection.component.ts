import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.css'
})
export class ConnectionComponent implements OnInit {
  private messageSubscription!: Subscription;
  messageData: { sender: string; text: string; role: string; senderId: string }[] = [];
  newMessage: string = '';
  names: string = '';
  roles: string = '';
  colorMap: { [key: string]: string } = {};
  eve: any;
  roomName: string = '';
  chat_data: any;
  senderId:any;
  name:any;

  constructor(
    private socket: SocketService,
    private eventService: EventService,
    private router:Router,
    private authService:AuthService
  ) {}

  ngOnInit() {
  }

  joinRoom() {
    if (!this.roomName.trim()) return;
    this.socket.emit('joinRoom', this.roomName); 
    this.router.navigate([`/chat-room/${this.roomName}`]);
  }

 
  userDashboard(){
    this.router.navigate(['/user'])
  }
}
