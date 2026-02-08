import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersService } from '@proto/users-data';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthActions } from './auth.actions';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private usersService = inject(UsersService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.usersService.login(email, password).pipe(
          map((response: any) => {
            const { user, access_token } = response;
            // Store in localStorage
            localStorage.setItem(AUTH_TOKEN_KEY, access_token);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
            return AuthActions.loginSuccess({ user, token: access_token });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message || 'Login failed' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          // Use replaceUrl to avoid view transition conflicts
          this.router.navigate(['/'], { replaceUrl: true });
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        this.router.navigate(['/login'], { replaceUrl: true });
      }),
      map(() => AuthActions.logoutComplete())
    )
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      map(() => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userJson = localStorage.getItem(AUTH_USER_KEY);

        if (token && userJson) {
          try {
            const user = JSON.parse(userJson);
            return AuthActions.checkAuthSuccess({ user, token });
          } catch {
            return AuthActions.checkAuthFailure();
          }
        }
        return AuthActions.checkAuthFailure();
      })
    )
  );
}
