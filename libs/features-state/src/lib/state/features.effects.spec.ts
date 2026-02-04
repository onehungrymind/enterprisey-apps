import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import * as FeaturesActions from './features.actions';
import { FeaturesEffects } from './features.effects';
describe('FeaturesEffects', () => {
  let actions: Observable<Action>;
  let effects: FeaturesEffects;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        FeaturesEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });
    effects = TestBed.inject(FeaturesEffects);
  });
  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: FeaturesActions.initFeatures() });
      const expected = hot('-a-|', {
        a: FeaturesActions.loadFeaturesSuccess({ features: [] }),
      });
      expect(effects.init$).toBeObservable(expected);
    });
  });
});
