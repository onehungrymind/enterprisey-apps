import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as UsersActions from './users.actions';
import { UsersEffects } from './users.effects';
import { UsersFacade } from './users.facade';
import { UsersEntity } from './users.models';
import {
  USERS_FEATURE_KEY,
  UsersState,
  initialUsersState,
  usersReducer,
} from './users.reducer';
import * as UsersSelectors from './users.selectors';

interface TestSchema {
  users: UsersState;
}

describe('UsersFacade', () => {
  let facade: UsersFacade;
  let store: Store<TestSchema>;
  const createUsersEntity = (id: string, name = ''): UsersEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
          EffectsModule.forFeature([UsersEffects]),
        ],
        providers: [UsersFacade],
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
      facade = TestBed.inject(UsersFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allUsers$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allUsers$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadUsersSuccess` to manually update list
     */
    it('allUsers$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allUsers$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        UsersActions.loadUsersSuccess({
          users: [createUsersEntity('AAA'), createUsersEntity('BBB')],
        })
      );

      list = await readFirst(facade.allUsers$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
