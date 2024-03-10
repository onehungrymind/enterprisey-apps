import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as FlashcardsActions from './flashcards.actions';
import { FlashcardsEffects } from './flashcards.effects';
import { FlashcardsFacade } from './flashcards.facade';
import { FlashcardsEntity } from './flashcards.models';
import {
  FLASHCARDS_FEATURE_KEY,
  FlashcardsState,
  initialFlashcardsState,
  flashcardsReducer,
} from './flashcards.reducer';
import * as FlashcardsSelectors from './flashcards.selectors';

interface TestSchema {
  flashcards: FlashcardsState;
}

describe('FlashcardsFacade', () => {
  let facade: FlashcardsFacade;
  let store: Store<TestSchema>;
  const createFlashcardsEntity = (id: string, name = ''): FlashcardsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(FLASHCARDS_FEATURE_KEY, flashcardsReducer),
          EffectsModule.forFeature([FlashcardsEffects]),
        ],
        providers: [FlashcardsFacade],
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
      facade = TestBed.inject(FlashcardsFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allFlashcards$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allFlashcards$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadFlashcardsSuccess` to manually update list
     */
    it('allFlashcards$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allFlashcards$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        FlashcardsActions.loadFlashcardsSuccess({
          flashcards: [
            createFlashcardsEntity('AAA'),
            createFlashcardsEntity('BBB'),
          ],
        })
      );

      list = await readFirst(facade.allFlashcards$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
