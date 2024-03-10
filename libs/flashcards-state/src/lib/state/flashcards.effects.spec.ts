import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as FlashcardsActions from './flashcards.actions';
import { FlashcardsEffects } from './flashcards.effects';

describe('FlashcardsEffects', () => {
  let actions: Observable<Action>;
  let effects: FlashcardsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        FlashcardsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(FlashcardsEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: FlashcardsActions.initFlashcards() });

      const expected = hot('-a-|', {
        a: FlashcardsActions.loadFlashcardsSuccess({ flashcards: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
