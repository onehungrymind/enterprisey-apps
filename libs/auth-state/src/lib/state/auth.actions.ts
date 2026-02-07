import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '@proto/api-interfaces';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
    'Logout Complete': emptyProps(),
    'Check Auth': emptyProps(),
    'Check Auth Success': props<{ user: User; token: string }>(),
    'Check Auth Failure': emptyProps(),
  },
});
