import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as ChallengesActions from './challenges.actions';
import { ChallengesEffects } from './challenges.effects';

describe('ChallengesEffects', () => {
  let actions: Observable<Action>;
  let effects: ChallengesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ChallengesEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(ChallengesEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ChallengesActions.initChallenges() });

      const expected = hot('-a-|', {
        a: ChallengesActions.loadChallengesSuccess({ challenges: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
