import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as ChallengesActions from './challenges.actions';
import * as ChallengesFeature from './challenges.reducer';
import * as ChallengesSelectors from './challenges.selectors';

@Injectable()
export class ChallengesFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(ChallengesSelectors.selectChallengesLoaded));
  allChallenges$ = this.store.pipe(
    select(ChallengesSelectors.selectAllChallenges)
  );
  selectedChallenges$ = this.store.pipe(
    select(ChallengesSelectors.selectEntity)
  );

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(ChallengesActions.initChallenges());
  }
}
