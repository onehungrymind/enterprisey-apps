import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as ChallengesActions from './challenges.actions';
import { ChallengesEffects } from './challenges.effects';
import { ChallengesFacade } from './challenges.facade';
import { ChallengesEntity } from './challenges.models';
import {
  CHALLENGES_FEATURE_KEY,
  ChallengesState,
  initialChallengesState,
  challengesReducer,
} from './challenges.reducer';
import * as ChallengesSelectors from './challenges.selectors';

interface TestSchema {
  challenges: ChallengesState;
}

describe('ChallengesFacade', () => {
  let facade: ChallengesFacade;
  let store: Store<TestSchema>;
  const createChallengesEntity = (id: string, name = ''): ChallengesEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(CHALLENGES_FEATURE_KEY, challengesReducer),
          EffectsModule.forFeature([ChallengesEffects]),
        ],
        providers: [ChallengesFacade],
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
      facade = TestBed.inject(ChallengesFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allChallenges$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allChallenges$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadChallengesSuccess` to manually update list
     */
    it('allChallenges$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allChallenges$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        ChallengesActions.loadChallengesSuccess({
          challenges: [
            createChallengesEntity('AAA'),
            createChallengesEntity('BBB'),
          ],
        })
      );

      list = await readFirst(facade.allChallenges$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
