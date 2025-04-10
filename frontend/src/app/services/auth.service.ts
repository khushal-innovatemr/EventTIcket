import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) {}

  private header_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true
  };

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password}, this.header_options);
  }

  register(name:string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, {name, email, password, role}, this.header_options);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  Delete_user(userId: string): Observable<any> { 
    console.log('-------------------------x-----------------')
    console.log('Deleting user with ID:', userId);
    return this.http.delete(`${this.API_URL}/user-delete/${userId}`,{headers:this.getHeaders(),withCredentials:true});
  }

  googleLogin(credential: string): Observable<any> {
    return this.http.post(`${this.API_URL}/google`, { credential });
  }

}