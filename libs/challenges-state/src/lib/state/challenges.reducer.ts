import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as ChallengesActions from './challenges.actions';
import { ChallengesEntity } from './challenges.models';

export const CHALLENGES_FEATURE_KEY = 'challenges';

export interface ChallengesState extends EntityState<ChallengesEntity> {
  selectedId?: string | number; // which Challenges record has been selected
  loaded: boolean; // has the Challenges list been loaded
  error?: string | null; // last known error (if any)
}

export interface ChallengesPartialState {
  readonly [CHALLENGES_FEATURE_KEY]: ChallengesState;
}

export const challengesAdapter: EntityAdapter<ChallengesEntity> =
  createEntityAdapter<ChallengesEntity>();

export const initialChallengesState: ChallengesState =
  challengesAdapter.getInitialState({
    // set initial required properties
    loaded: false,
  });

const reducer = createReducer(
  initialChallengesState,
  on(ChallengesActions.initChallenges, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(ChallengesActions.loadChallengesSuccess, (state, { challenges }) =>
    challengesAdapter.setAll(challenges, { ...state, loaded: true })
  ),
  on(ChallengesActions.loadChallengesFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function challengesReducer(
  state: ChallengesState | undefined,
  action: Action
) {
  return reducer(state, action);
}
