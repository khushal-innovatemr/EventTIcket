import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        try {
          const token_data = JSON.parse(atob(token.split('.')[1])); 
          if (token_data.role === 'user') {
            const restrictedRoutes = ['/login', '/register','/organise','/event','/manager'];
            if (restrictedRoutes.includes(state.url)) {
              console.log("Users cannot go to login, register, or organize/admin routes, redirecting to /user");
              this.router.navigate(['/user']);
              return false;
            }
            return true;
          } else {
            if (state.url.includes('/user')) {
              this.router.navigate(['/view']);
              return false;
            }
            return true;
          }
        } catch (error) {
          console.error("Invalid token format:", error);
        }
      }
    }
    // this.router.navigate(['/login']);
    return false;
  }
}