import { FeaturesEntity } from './features.models';
import {
  featuresAdapter,
  FeaturesPartialState,
  initialFeaturesState,
} from './features.reducer';
import * as FeaturesSelectors from './features.selectors';

describe('Features Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getFeaturesId = (it: FeaturesEntity) => it.id;
  const createFeaturesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as FeaturesEntity);

  let state: FeaturesPartialState;

  beforeEach(() => {
    state = {
      features: featuresAdapter.setAll(
        [
          createFeaturesEntity('PRODUCT-AAA'),
          createFeaturesEntity('PRODUCT-BBB'),
          createFeaturesEntity('PRODUCT-CCC'),
        ],
        {
          ...initialFeaturesState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Features Selectors', () => {
    it('selectAllFeatures() should return the list of Features', () => {
      const results = FeaturesSelectors.selectAllFeatures(state);
      const selId = getFeaturesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = FeaturesSelectors.selectEntity(state) as FeaturesEntity;
      const selId = getFeaturesId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectFeaturesLoaded() should return the current "loaded" status', () => {
      const result = FeaturesSelectors.selectFeaturesLoaded(state);

      expect(result).toBe(true);
    });

    it('selectFeaturesError() should return the current "error" state', () => {
      const result = FeaturesSelectors.selectFeaturesError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
