import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as WorkshopsActions from './workshops.actions';
import { WorkshopsEffects } from './workshops.effects';
import { WorkshopsFacade } from './workshops.facade';
import { WorkshopsEntity } from './workshops.models';
import {
  WORKSHOPS_FEATURE_KEY,
  WorkshopsState,
  initialWorkshopsState,
  workshopsReducer,
} from './workshops.reducer';
import * as WorkshopsSelectors from './workshops.selectors';

interface TestSchema {
  workshops: WorkshopsState;
}

describe('WorkshopsFacade', () => {
  let facade: WorkshopsFacade;
  let store: Store<TestSchema>;
  const createWorkshopsEntity = (id: string, name = ''): WorkshopsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(WORKSHOPS_FEATURE_KEY, workshopsReducer),
          EffectsModule.forFeature([WorkshopsEffects]),
        ],
        providers: [WorkshopsFacade],
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
      facade = TestBed.inject(WorkshopsFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allWorkshops$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allWorkshops$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadWorkshopsSuccess` to manually update list
     */
    it('allWorkshops$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allWorkshops$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        WorkshopsActions.loadWorkshopsSuccess({
          workshops: [
            createWorkshopsEntity('AAA'),
            createWorkshopsEntity('BBB'),
          ],
        })
      );

      list = await readFirst(facade.allWorkshops$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
