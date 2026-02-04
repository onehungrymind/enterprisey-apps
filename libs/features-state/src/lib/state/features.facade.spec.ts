import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';
import * as FeaturesActions from './features.actions';
import { FeaturesEffects } from './features.effects';
import { FeaturesFacade } from './features.facade';
import { FeaturesEntity } from './features.models';
import {
  FEATURES_FEATURE_KEY,
  FeaturesState,
  initialFeaturesState,
  featuresReducer,
} from './features.reducer';
import * as FeaturesSelectors from './features.selectors';
interface TestSchema {
  features: FeaturesState;
}
describe('FeaturesFacade', () => {
  let facade: FeaturesFacade;
  let store: Store<TestSchema>;
  const createFeaturesEntity = (id: string, name = ''): FeaturesEntity => ({
    id,
    name: name || `name-${id}`,
  });
  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(FEATURES_FEATURE_KEY, featuresReducer),
          EffectsModule.forFeature([FeaturesEffects]),
        ],
        providers: [FeaturesFacade],
      })
      class CustomFeatureModule {}
      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });
      store = TestBed.inject(Store);
      facade = TestBed.inject(FeaturesFacade);
    });
    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allFeatures$);
      let isLoaded = await readFirst(facade.loaded$);
      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);
      facade.init();
      list = await readFirst(facade.allFeatures$);
      isLoaded = await readFirst(facade.loaded$);
      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });
    /**
     * Use `loadFeaturesSuccess` to manually update list
     */
    it('allFeatures$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allFeatures$);
      let isLoaded = await readFirst(facade.loaded$);
      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);
      store.dispatch(
        FeaturesActions.loadFeaturesSuccess({
          features: [createFeaturesEntity('AAA'), createFeaturesEntity('BBB')],
        })
      );
      list = await readFirst(facade.allFeatures$);
      isLoaded = await readFirst(facade.loaded$);
      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
