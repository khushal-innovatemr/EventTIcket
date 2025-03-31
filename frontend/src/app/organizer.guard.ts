import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizerGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        try {
          const token_data = JSON.parse(atob(token.split('.')[1])); 
          if (token_data.role === 'organizer') {
            const restrictedRoutes = ['/login', '/register','/view','/user','/user-view'];
            if (restrictedRoutes.includes(state.url)) {
              console.log("Organizers cannot go to login, register, or view routes, redirecting to /admin");
              this.router.navigate(['/organise']);
              return false;
            }
            return true;
          } else {
            if (state.url.includes('/organise')) {
              this.router.navigate(['/event']);
              return false;
            }
            return true;
          }
        } catch (error) {
          console.error("Invalid token format:", error);
        }
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}