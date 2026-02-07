import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard, guestGuard } from '@proto/auth-guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    canActivate: [guestGuard],
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
  },
];
