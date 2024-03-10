import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '@proto/api-interfaces';

export const UsersActions = createActionGroup({
  source: 'Users API',
  events: {
    'Select User': props<{ selectedId: string }>(),
    'Reset Selected User': emptyProps(),
    'Reset Users': emptyProps(),
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: any }>(),
    'Load User': props<{ userId: string }>(),
    'Load User Success': props<{ user: User }>(),
    'Load User Failure': props<{ error: any }>(),
    'Create User': props<{ user: User }>(),
    'Create User Success': props<{ user: User }>(),
    'Create User Failure': props<{ error: any }>(),
    'Update User': props<{ user: User }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: any }>(),
    'Delete User': props<{ user: User }>(),
    'Delete User Success': props<{ user: User }>(),
    'Delete User Failure': props<{ error: any }>(),
    'Delete User Cancelled': emptyProps(),
    'Upsert User': props<{ user: User }>(),
    'Upsert User Success': props<{ user: User }>(),
    'Upsert User Failure': props<{ error: any }>(),
  }
});
