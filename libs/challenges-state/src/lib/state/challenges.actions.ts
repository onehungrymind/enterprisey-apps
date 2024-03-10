import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Challenge } from '@proto/api-interfaces';

export const ChallengesActions = createActionGroup({
  source: 'Challenges API',
  events: {
    'Select Challenge': props<{ selectedId: string }>(),
    'Reset Selected Challenge': emptyProps(),
    'Reset Challenges': emptyProps(),
    'Load Challenges': emptyProps(),
    'Load Challenges Success': props<{ challenges: Challenge[] }>(),
    'Load Challenges Failure': props<{ error: any }>(),
    'Load Challenge': props<{ challengeId: string }>(),
    'Load Challenge Success': props<{ challenge: Challenge }>(),
    'Load Challenge Failure': props<{ error: any }>(),
    'Create Challenge': props<{ challenge: Challenge }>(),
    'Create Challenge Success': props<{ challenge: Challenge }>(),
    'Create Challenge Failure': props<{ error: any }>(),
    'Update Challenge': props<{ challenge: Challenge }>(),
    'Update Challenge Success': props<{ challenge: Challenge }>(),
    'Update Challenge Failure': props<{ error: any }>(),
    'Delete Challenge': props<{ challenge: Challenge }>(),
    'Delete Challenge Success': props<{ challenge: Challenge }>(),
    'Delete Challenge Failure': props<{ error: any }>(),
    'Delete Challenge Cancelled': emptyProps(),
    'Upsert Challenge': props<{ challenge: Challenge }>(),
    'Upsert Challenge Success': props<{ challenge: Challenge }>(),
    'Upsert Challenge Failure': props<{ error: any }>(),
  }
});
