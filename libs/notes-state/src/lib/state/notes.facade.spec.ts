import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as NotesActions from './notes.actions';
import { NotesEffects } from './notes.effects';
import { NotesFacade } from './notes.facade';
import { NotesEntity } from './notes.models';
import {
  NOTES_FEATURE_KEY,
  NotesState,
  initialNotesState,
  notesReducer,
} from './notes.reducer';
import * as NotesSelectors from './notes.selectors';

interface TestSchema {
  notes: NotesState;
}

describe('NotesFacade', () => {
  let facade: NotesFacade;
  let store: Store<TestSchema>;
  const createNotesEntity = (id: string, name = ''): NotesEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(NOTES_FEATURE_KEY, notesReducer),
          EffectsModule.forFeature([NotesEffects]),
        ],
        providers: [NotesFacade],
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
      facade = TestBed.inject(NotesFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allNotes$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allNotes$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadNotesSuccess` to manually update list
     */
    it('allNotes$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allNotes$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        NotesActions.loadNotesSuccess({
          notes: [createNotesEntity('AAA'), createNotesEntity('BBB')],
        })
      );

      list = await readFirst(facade.allNotes$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
