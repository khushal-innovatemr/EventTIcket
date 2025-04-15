import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'    
})
export class EventService {
  private API_URL = 'http://localhost:3000/event';

  constructor(private http: HttpClient, private router: Router,private authService:AuthService) {}


  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
      
    });
  }

  Add_event(formData:any):Observable<any>{
    return this.http.post(`${this.API_URL}/add-event`,formData,{headers:this.getHeaders(),withCredentials:true});
  }

  view_event():Observable<any> {
    return this.http.get(`${this.API_URL}/view-event`,{headers:this.getHeaders(),withCredentials:true});
  }

  admin_view():Observable<any> {
    return this.http.get(`${this.API_URL}/view-event`,{headers:this.getHeaders(),withCredentials:true});
  }

  book_event(eventId: string,Ticket:number): Observable<any> {
    const token = localStorage.getItem('token');  
    return this.http.post(`${this.API_URL}/book/${eventId}`, {Ticket}, {headers:this.getHeaders() });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.API_URL}/views`,{headers:this.getHeaders(),withCredentials:true});
  }

  generateTicket():Observable<any> {
    return this.http.get(`${this.API_URL}/ticket`,{headers:this.getHeaders(),withCredentials:true});
  }
 
  organize_view():Observable<any> {
    return this.http.get(`${this.API_URL}/organizer`,{headers:this.getHeaders(),withCredentials:true})
  }

  Delete_event(Event_id: string): Observable<any> { 
    console.log('Deleting Bookings with ID:', Event_id);
    return this.http.delete(`${this.API_URL}/delete/${Event_id}`);
  }

  Cancel_Ticket(Ticket_id: string): Observable<any> {
    console.log('Deleting Bookings with ID:', Ticket_id);
    return this.http.post<any>(`${this.API_URL}/cancel/${Ticket_id}`,{headers:this.getHeaders(),withCredentials:true});
}

  Approve_Booking(Ticket_id:string): Observable<any> {
    console.log('Approval of Booking with ID:',Ticket_id);
    return this.http.post<any>(`${this.API_URL}/approval/${Ticket_id}`,{headers:this.getHeaders(),withCredentials:true});
  }

  Reject_Booking(Ticket_id:string): Observable<any> {
    console.log('Booking with ID:',Ticket_id, 'is Rejected');
    return this.http.post<any>(`${this.API_URL}/reject/${Ticket_id}`,{headers:this.getHeaders(),withCredentials:true})
  }

  createPaymentIntent(Event_Id: string, ticketCount: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${Event_Id}/events/payment-intent`, { Ticket: ticketCount },{headers:this.getHeaders(),withCredentials:true});
  }

  confirmBooking(Event_Id: string, paymentIntentId: string,Ticket:any): Observable<any> {
    return this.http.post(`${this.API_URL}/${Event_Id}/events`, { paymentIntentId,Ticket },{
      headers:this.getHeaders(),withCredentials:true
    });
  }

  collectAmount():Observable<any>{
    return this.http.get(`${this.API_URL}/amount_collect`);
  }

  chatData(messages:any[]):Observable<any>{
    return this.http.post(`${this.API_URL}/chats`,{messages})
  }

  viewChat():Observable<any>{
    return this.http.get(`${this.API_URL}/chats`,{})
  }
}

