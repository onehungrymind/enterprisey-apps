import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CHALLENGES_FEATURE_KEY,
  ChallengesState,
  challengesAdapter,
} from './challenges.reducer';

// Lookup the 'Challenges' feature state managed by NgRx
export const selectChallengesState = createFeatureSelector<ChallengesState>(
  CHALLENGES_FEATURE_KEY
);

const { selectAll, selectEntities } = challengesAdapter.getSelectors();

export const selectChallengesLoaded = createSelector(
  selectChallengesState,
  (state: ChallengesState) => state.loaded
);

export const selectChallengesError = createSelector(
  selectChallengesState,
  (state: ChallengesState) => state.error
);

export const selectAllChallenges = createSelector(
  selectChallengesState,
  (state: ChallengesState) => selectAll(state)
);

export const selectChallengesEntities = createSelector(
  selectChallengesState,
  (state: ChallengesState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectChallengesState,
  (state: ChallengesState) => state.selectedId
);

export const selectEntity = createSelector(
  selectChallengesEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
