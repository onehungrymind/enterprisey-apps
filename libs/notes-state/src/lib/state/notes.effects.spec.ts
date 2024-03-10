import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as NotesActions from './notes.actions';
import { NotesEffects } from './notes.effects';

describe('NotesEffects', () => {
  let actions: Observable<Action>;
  let effects: NotesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        NotesEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(NotesEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: NotesActions.initNotes() });

      const expected = hot('-a-|', {
        a: NotesActions.loadNotesSuccess({ notes: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
