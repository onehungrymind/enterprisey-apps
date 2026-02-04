import { Challenge } from '@proto/api-interfaces';
import { mockChallenge, mockEmptyChallenge } from '@proto/testing';
import { ChallengesActions } from './challenges.actions';
import {
  ChallengesState,
  initialChallengesState,
  reducer,
} from './challenges.reducer';
describe('Challenges Reducer', () => {
  let challenges: Challenge[];
  beforeEach(() => {
    challenges = [
      { ...mockChallenge, id: '0' },
      { ...mockChallenge, id: '1' },
      { ...mockChallenge, id: '2' },
    ];
  });
  describe('valid Challenges actions', () => {
    it('loadChallenges should set loaded to false', () => {
      const action = ChallengesActions.loadChallenges();
      const expectedState = {
        ...initialChallengesState,
        error: null,
      };
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadChallengesSuccess should set the list of known Challenges', () => {
      const action = ChallengesActions.loadChallengesSuccess({ challenges });
      const expectedState = {
        ...initialChallengesState,
        loaded: true,
        entities: {
          0: challenges[0],
          1: challenges[1],
          2: challenges[2],
        },
        ids: challenges.map((challenge) => challenge.id),
      };
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadChallengesFailure should set error to error', () => {
      const error = new Error();
      const action = ChallengesActions.loadChallengesFailure({ error });
      const expectedState = {
        ...initialChallengesState,
        error,
      };
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadChallenge should set loaded to false', () => {
      const action = ChallengesActions.loadChallenge({
        challengeId: mockChallenge.id as string,
      });
      const expectedState = {
        ...initialChallengesState,
        loaded: false,
        error: null,
      };
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadChallengeSuccess should set loaded to true', () => {
      const action = ChallengesActions.loadChallengeSuccess({
        challenge: mockChallenge,
      });
      const expectedState = {
        ...initialChallengesState,
        loaded: true,
        entities: {
          0: mockChallenge,
        },
        ids: [mockChallenge.id],
      };
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('loadChallengeFailure should set error to error', () => {
      const error = new Error();
      const action = ChallengesActions.loadChallengeFailure({ error });
      const expectedState = {
        ...initialChallengesState,
        error,
      };
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('updateChallengeSuccess should modify challenge', () => {
      const prepAction = ChallengesActions.loadChallengeSuccess({
        challenge: { ...mockEmptyChallenge, id: mockChallenge.id },
      });
      const prepState: ChallengesState = reducer(
        initialChallengesState,
        prepAction
      );
      const expectedState = {
        ...initialChallengesState,
        loaded: true,
        entities: {
          0: mockChallenge,
        },
        ids: [mockChallenge.id],
      };
      const action = ChallengesActions.updateChallengeSuccess({
        challenge: mockChallenge,
      });
      const result: ChallengesState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('updateChallengeFailure should set error to error', () => {
      const error = new Error();
      const action = ChallengesActions.updateChallengeFailure({ error });
      const expectedState = {
        ...initialChallengesState,
        error: error,
      };
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('createChallengeSuccess should add challenge', () => {
      const action = ChallengesActions.createChallengeSuccess({
        challenge: mockChallenge,
      });
      const expectedState = {
        ...initialChallengesState,
        loaded: false,
        entities: {
          0: mockChallenge,
        },
        ids: [mockChallenge.id],
      };
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('createChallengeFailure should set error to error', () => {
      const error = new Error();
      const action = ChallengesActions.createChallengeFailure({ error });
      const expectedState = {
        ...initialChallengesState,
        error,
      };
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('deleteChallengeSuccess should add challenge', () => {
      const prepAction = ChallengesActions.loadChallengeSuccess({
        challenge: mockChallenge,
      });
      const prepState: ChallengesState = reducer(
        initialChallengesState,
        prepAction
      );
      const expectedState = {
        ...initialChallengesState,
        loaded: true,
      };
      const action = ChallengesActions.deleteChallengeSuccess({
        challenge: mockChallenge,
      });
      const result: ChallengesState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('deleteChallengeFailure should set error to error', () => {
      const error = new Error();
      const action = ChallengesActions.deleteChallengeFailure({ error });
      const expectedState = {
        ...initialChallengesState,
        error,
      };
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('selectChallenge should set selectedId', () => {
      const action = ChallengesActions.selectChallenge({
        selectedId: mockChallenge.id as string,
      });
      const expectedState = {
        ...initialChallengesState,
        selectedId: mockChallenge.id,
      };
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('resetSelectedChallenge should reset selectedId', () => {
      const prepAction = ChallengesActions.selectChallenge({
        selectedId: mockChallenge.id as string,
      });
      const prepState = reducer(initialChallengesState, prepAction);
      const action = ChallengesActions.resetSelectedChallenge();
      const expectedState = {
        ...initialChallengesState,
        selectedId: null,
      };
      const result: ChallengesState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
    it('resetChallenges should reset challenges', () => {
      const prepAction = ChallengesActions.loadChallengesSuccess({
        challenges,
      });
      const prepState: ChallengesState = reducer(
        initialChallengesState,
        prepAction
      );
      const expectedState = {
        ...initialChallengesState,
        loaded: true,
      };
      const action = ChallengesActions.resetChallenges();
      const result: ChallengesState = reducer(prepState, action);
      expect(result).toStrictEqual(expectedState);
    });
  });
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result: ChallengesState = reducer(initialChallengesState, action);
      expect(result).toBe(initialChallengesState);
    });
  });
});
