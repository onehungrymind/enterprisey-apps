import { Action } from '@ngrx/store';

import * as ChallengesActions from './challenges.actions';
import { ChallengesEntity } from './challenges.models';
import {
  ChallengesState,
  initialChallengesState,
  challengesReducer,
} from './challenges.reducer';

describe('Challenges Reducer', () => {
  const createChallengesEntity = (id: string, name = ''): ChallengesEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Challenges actions', () => {
    it('loadChallengesSuccess should return the list of known Challenges', () => {
      const challenges = [
        createChallengesEntity('PRODUCT-AAA'),
        createChallengesEntity('PRODUCT-zzz'),
      ];
      const action = ChallengesActions.loadChallengesSuccess({ challenges });

      const result: ChallengesState = challengesReducer(
        initialChallengesState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = challengesReducer(initialChallengesState, action);

      expect(result).toBe(initialChallengesState);
    });
  });
});
