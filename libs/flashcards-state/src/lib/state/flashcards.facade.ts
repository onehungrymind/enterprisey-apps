import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as FlashcardsActions from './flashcards.actions';
import * as FlashcardsFeature from './flashcards.reducer';
import * as FlashcardsSelectors from './flashcards.selectors';

@Injectable()
export class FlashcardsFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(FlashcardsSelectors.selectFlashcardsLoaded));
  allFlashcards$ = this.store.pipe(
    select(FlashcardsSelectors.selectAllFlashcards)
  );
  selectedFlashcards$ = this.store.pipe(
    select(FlashcardsSelectors.selectEntity)
  );

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(FlashcardsActions.initFlashcards());
  }
}
