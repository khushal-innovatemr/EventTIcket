import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { ViewEventComponent } from './components/view-event/view-event.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './auth.guard';
import { RedirectGuard } from './redirect.guard';
import { RoleGuard } from './role.guard';
import { AdminGuard } from './admin.guard';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { UserComponent } from './components/user/user.component';
import { OrganizerComponent } from './components/organizer/organizer.component';
import { OrganizerGuard } from './organizer.guard';
import { UserGuard } from './user.guard';
import { EventOrganizerComponent } from './components/event-organizer/event-organizer.component';
import { BookingComponent } from './components/booking/booking.component';
import { TAComponent } from './components/t-a/t-a.component';
import { AbcComponent } from './components/abc/abc.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate:[RedirectGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate:[RedirectGuard]
    },
    {
        path:'event',
        component:AddEventComponent,    
        canActivate:[AuthGuard,AdminGuard,UserGuard]
    },
    {
        path:'view',
        component:ViewEventComponent,
        canActivate:[AuthGuard,AdminGuard,OrganizerGuard]
    },
    {
        path:'admin-register',
        component:AdminRegisterComponent,
        canActivate:[RoleGuard]
    },
    {
        path:'admin-view',
        component:AdminViewComponent,
        canActivate:[RoleGuard]
    },
    {
        path:'admin',
        component:AdminComponent,
        canActivate:[RoleGuard]
    },
    {
        path:'user-view',
        component:UserViewComponent,
        canActivate:[AdminGuard,OrganizerGuard]
    },
    {
        path: 'user',
        component:UserComponent,
        canActivate:[AdminGuard,OrganizerGuard]
    },
    {
        path:'organise',
        component:OrganizerComponent,
        canActivate:[UserGuard]
    },
    {
        path:'manager',
        component:EventOrganizerComponent,
        canActivate:[UserGuard]
    },
    {
        path:'booking/:id/:ticket',
        component:BookingComponent,
        canActivate:[AdminGuard,OrganizerGuard]
    },
    {
        path:'amount',
        component:TAComponent,
    },
    {
        path:'home',
        component:AbcComponent
    },
    {
        path:'**',
        redirectTo:'home'
    }
   
];
