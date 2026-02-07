import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersService } from '@proto/users-data';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthActions } from './auth.actions';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export const login = createEffect(
  (actions$ = inject(Actions), usersService = inject(UsersService)) => {
    return actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        usersService.login(email, password).pipe(
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
    );
  },
  { functional: true }
);

export const loginSuccess = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => {
        router.navigate(['/']);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const logout = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        router.navigate(['/login']);
      }),
      map(() => AuthActions.logoutComplete())
    );
  },
  { functional: true }
);

export const checkAuth = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
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
    );
  },
  { functional: true }
);
