import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnifiedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      // Redirect unauthenticated users to login
      this.router.navigate(['/login']);
      return false;
    }

    const token = this.authService.getToken();
    if (!token) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1])); 
      const userRole = tokenData.role;

      const roleRestrictions: { [key: string]: string[] } = {
        admin: ['/login', '/register', '/event', '/view', '/user', '/user-view', '/organise'],
        organizer: ['/login', '/register', '/view', '/user', '/user-view','/admin','admin-register','admin-view'],
        user: ['/login', '/register', '/organise', '/event', '/manager','/admin','admin-register','admin-view']
      };

      const roleRedirects: { [key: string]: string } = {
        admin: '/admin',
        organizer: '/organise',
        user: '/user'
      };

      const restrictedRoutes = roleRestrictions[userRole] || [];
      if (restrictedRoutes.includes(state.url)) {
        console.log(`Access denied for role ${userRole} to route ${state.url}`);
        this.router.navigate([roleRedirects[userRole]]);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
  }
}