import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor(private authService:AuthService) {
    this.socket = io('http://localhost:3000', {
      withCredentials: true,
    });
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  // on(event: string): Observable<any> {
  //   return new Observable((observer) => {
  //     this.socket.on(event, (data) => {
  //       observer.next(data);
  //     });
  //     return () => {
  //       this.socket.off(event);
  //     }
  //   })
  // }
  on(event: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data: any) => {
        subscriber.next(data);
      });
    });
  }
}
