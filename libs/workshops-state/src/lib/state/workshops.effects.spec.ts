import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as WorkshopsActions from './workshops.actions';
import { WorkshopsEffects } from './workshops.effects';

describe('WorkshopsEffects', () => {
  let actions: Observable<Action>;
  let effects: WorkshopsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        WorkshopsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(WorkshopsEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: WorkshopsActions.initWorkshops() });

      const expected = hot('-a-|', {
        a: WorkshopsActions.loadWorkshopsSuccess({ workshops: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
