import { ChallengesEntity } from './challenges.models';
import {
  challengesAdapter,
  ChallengesPartialState,
  initialChallengesState,
} from './challenges.reducer';
import * as ChallengesSelectors from './challenges.selectors';

describe('Challenges Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getChallengesId = (it: ChallengesEntity) => it.id;
  const createChallengesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ChallengesEntity);

  let state: ChallengesPartialState;

  beforeEach(() => {
    state = {
      challenges: challengesAdapter.setAll(
        [
          createChallengesEntity('PRODUCT-AAA'),
          createChallengesEntity('PRODUCT-BBB'),
          createChallengesEntity('PRODUCT-CCC'),
        ],
        {
          ...initialChallengesState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Challenges Selectors', () => {
    it('selectAllChallenges() should return the list of Challenges', () => {
      const results = ChallengesSelectors.selectAllChallenges(state);
      const selId = getChallengesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = ChallengesSelectors.selectEntity(
        state
      ) as ChallengesEntity;
      const selId = getChallengesId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectChallengesLoaded() should return the current "loaded" status', () => {
      const result = ChallengesSelectors.selectChallengesLoaded(state);

      expect(result).toBe(true);
    });

    it('selectChallengesError() should return the current "error" state', () => {
      const result = ChallengesSelectors.selectChallengesError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
