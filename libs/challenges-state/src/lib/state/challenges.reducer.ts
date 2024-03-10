import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Challenge } from '@proto/api-interfaces';
import { ChallengesActions } from './challenges.actions';

export interface ChallengesState extends EntityState<Challenge> {
  selectedId?: string | undefined;
  error?: string | null;
  loaded: boolean;
}

export const challengesAdapter: EntityAdapter<Challenge> = createEntityAdapter<Challenge>();

export const initialChallengesState: ChallengesState = challengesAdapter.getInitialState({
  loaded: false,
});

const onFailure = (state: ChallengesState, { error }: any) => ({ ...state, error });

export const reducer = createReducer(
  initialChallengesState,
  // TBD
  on(ChallengesActions.loadChallenges, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(ChallengesActions.loadChallenge, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  // RESET
  on(ChallengesActions.selectChallenge, (state, { selectedId }) =>
    Object.assign({}, state, { selectedId })
  ),
  on(ChallengesActions.resetSelectedChallenge, (state) =>
    Object.assign({}, state, { selectedId: null })
  ),
  on(ChallengesActions.resetChallenges, (state) => challengesAdapter.removeAll(state)),
  // CRUD
  on(ChallengesActions.loadChallengesSuccess, (state, { challenges }) =>
    challengesAdapter.setAll(challenges, { ...state, loaded: true })
  ),
  on(ChallengesActions.loadChallengeSuccess, (state, { challenge }) =>
    challengesAdapter.upsertOne(challenge, { ...state, loaded: true })
  ),
  on(ChallengesActions.createChallengeSuccess, (state, { challenge }) =>
    challengesAdapter.addOne(challenge, state)
  ),
  on(ChallengesActions.updateChallengeSuccess, (state, { challenge }) =>
    challengesAdapter.updateOne({ id: challenge.id || '', changes: challenge }, state)
  ),
  on(ChallengesActions.deleteChallengeSuccess, (state, { challenge }) =>
    challengesAdapter.removeOne(challenge?.id ?? '', state)
  ),
  // FAILURE
  on(
    ChallengesActions.loadChallengesFailure,
    ChallengesActions.loadChallengeFailure,
    ChallengesActions.createChallengeFailure,
    ChallengesActions.createChallengeFailure,
    ChallengesActions.createChallengeFailure,
    onFailure
  )
);
