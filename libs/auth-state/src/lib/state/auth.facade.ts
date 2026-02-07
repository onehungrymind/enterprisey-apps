import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import * as AuthSelectors from './auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly store = inject(Store);

  user$ = this.store.pipe(select(AuthSelectors.getUser));
  token$ = this.store.pipe(select(AuthSelectors.getToken));
  loading$ = this.store.pipe(select(AuthSelectors.getLoading));
  error$ = this.store.pipe(select(AuthSelectors.getError));
  initialized$ = this.store.pipe(select(AuthSelectors.getInitialized));
  isAuthenticated$ = this.store.pipe(select(AuthSelectors.getIsAuthenticated));

  login(email: string, password: string) {
    this.store.dispatch(AuthActions.login({ email, password }));
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  checkAuth() {
    this.store.dispatch(AuthActions.checkAuth());
  }
}
