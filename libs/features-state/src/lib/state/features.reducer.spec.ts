import { Action } from '@ngrx/store';
import * as FeaturesActions from './features.actions';
import { FeaturesEntity } from './features.models';
import {
  FeaturesState,
  initialFeaturesState,
  featuresReducer,
} from './features.reducer';
describe('Features Reducer', () => {
  const createFeaturesEntity = (id: string, name = ''): FeaturesEntity => ({
    id,
    name: name || `name-${id}`,
  });
  describe('valid Features actions', () => {
    it('loadFeaturesSuccess should return the list of known Features', () => {
      const features = [
        createFeaturesEntity('PRODUCT-AAA'),
        createFeaturesEntity('PRODUCT-zzz'),
      ];
      const action = FeaturesActions.loadFeaturesSuccess({ features });
      const result: FeaturesState = featuresReducer(
        initialFeaturesState,
        action
      );
      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;
      const result = featuresReducer(initialFeaturesState, action);
      expect(result).toBe(initialFeaturesState);
    });
  });
});
