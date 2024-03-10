import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromChallenges from './challenges.reducer';

export const CHALLENGES_FEATURE_KEY = 'challenges';

export interface State {
  challenges: fromChallenges.ChallengesState;
}

export const reducers: ActionReducerMap<State> = {
  challenges: fromChallenges.reducer,
};

export const getChallengesState =
  createFeatureSelector<State>(CHALLENGES_FEATURE_KEY);
