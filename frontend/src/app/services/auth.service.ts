import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { GoogleLoginProvider } from 'angularx-social-login/lib/providers/google-login-provider';
import { SocialUser } from 'angularx-social-login';
import { AuthServiceConfig } from "angularx-social-login";


@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  private API_URL = 'http://localhost:3000/auth';
  user: any;

  constructor(private http: HttpClient, private router: Router,private authService:AuthServiceConfig) {
    this.authService.authState.subscribe((user:any) => {
      this.user = user;
    });
  }

  private header_options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
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

  signInWithGoogle(): Observable<SocialUser | null> {
    return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).pipe(
      map(user => {
        this.user = user;
        localStorage.setItem('google_auth', JSON.stringify(user));
        return user;
      }),
      catchError(error => {
        console.error('Google sign-in error', error);
        return of(null);
      })
    );
  }

  signOut(): void {
    this.authService.signOut();
    this.user = null;
    localStorage.removeItem('google_auth');
  }

}