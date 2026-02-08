import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Check localStorage directly - tokens are stored here on login
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('auth_user');
  const isAuthenticated = !!token && !!user;

  if (isAuthenticated) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
