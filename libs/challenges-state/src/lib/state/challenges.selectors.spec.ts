import { Challenge } from '@proto/api-interfaces';
import { mockChallenge } from '@proto/testing';
import {
  challengesAdapter,
  ChallengesState,
  initialChallengesState,
} from './challenges.reducer';
import * as ChallengesSelectors from './challenges.selectors';
describe('Challenges Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getChallengesId = (challenge: Challenge) => challenge['id'];
  const createChallenge = (id: string, name = '') =>
    ({ ...mockChallenge, id: id } as Challenge);
  let state: ChallengesState;
  beforeEach(() => {
    state = challengesAdapter.setAll(
      [
        createChallenge('PRODUCT-AAA'),
        createChallenge('PRODUCT-BBB'),
        createChallenge('PRODUCT-CCC'),
      ],
      {
        ...initialChallengesState,
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true,
      }
    );
  });
  describe('Challenges Selectors', () => {
    it('getAllChallenges() should return the list of Challenges', () => {
      const results = ChallengesSelectors.getAllChallenges.projector(state);
      const selId = getChallengesId(results[1]);
      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });
    it('getSelected() should return the selected schema', () => {
      const result = ChallengesSelectors.getSelectedChallenge.projector(
        state.entities,
        state.selectedId
      );
      const selId = getChallengesId(result as Challenge);
      expect(selId).toBe('PRODUCT-BBB');
    });
    it("getChallengesLoaded() should return the current 'loaded' status", () => {
      const result = ChallengesSelectors.getChallengesLoaded.projector(state);
      expect(result).toBe(true);
    });
    it("getChallengesError() should return the current 'error' state", () => {
      const result = ChallengesSelectors.getChallengesError.projector(state);
      expect(result).toBe(ERROR_MSG);
    });
  });
});
