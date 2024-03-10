import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { User } from '@proto/api-interfaces';
import { UsersService } from '@proto/users-data';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { UsersActions } from './users.actions';

export const loadUsers = createEffect(
  (actions$ = inject(Actions), usersService = inject(UsersService)) => {
    return actions$.pipe(
      ofType(UsersActions.loadUsers),
      exhaustMap((action, value) =>
        usersService.all().pipe(
          map((users: User[]) => UsersActions.loadUsersSuccess({ users })),
          catchError((error) => of(UsersActions.loadUsersFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loadUser = createEffect(
  (actions$ = inject(Actions), usersService = inject(UsersService)) => {
    return actions$.pipe(
      ofType(UsersActions.loadUser),
      exhaustMap((action, value) => {
        return usersService.find(action.userId).pipe(
          map((user: User) => UsersActions.loadUserSuccess({ user })),
          catchError((error) => of(UsersActions.loadUserFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const createUser = createEffect(
  (actions$ = inject(Actions), usersService = inject(UsersService)) => {
    return actions$.pipe(
      ofType(UsersActions.createUser),
      exhaustMap((action, value) => {
        return usersService.create(action.user).pipe(
          map((user: any) => UsersActions.createUserSuccess({ user })),
          catchError((error) => of(UsersActions.createUserFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const updateUser = createEffect(
  (actions$ = inject(Actions), usersService = inject(UsersService)) => {
    return actions$.pipe(
      ofType(UsersActions.updateUser),
      exhaustMap((action, value) => {
        return usersService.update(action.user).pipe(
          map((user: any) => UsersActions.updateUserSuccess({ user })),
          catchError((error) => of(UsersActions.updateUserFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const deleteUser = createEffect(
  (actions$ = inject(Actions), usersService = inject(UsersService)) => {
    return actions$.pipe(
      ofType(UsersActions.deleteUser),
      exhaustMap((action, value) => {
        return usersService.delete(action.user).pipe(
          map((user: any) => UsersActions.deleteUserSuccess({ user })),
          catchError((error) => of(UsersActions.deleteUserFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);
