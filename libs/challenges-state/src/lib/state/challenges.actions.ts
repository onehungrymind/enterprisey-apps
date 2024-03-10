import { createAction, props } from '@ngrx/store';
import { ChallengesEntity } from './challenges.models';

export const initChallenges = createAction('[Challenges Page] Init');

export const loadChallengesSuccess = createAction(
  '[Challenges/API] Load Challenges Success',
  props<{ challenges: ChallengesEntity[] }>()
);

export const loadChallengesFailure = createAction(
  '[Challenges/API] Load Challenges Failure',
  props<{ error: any }>()
);
