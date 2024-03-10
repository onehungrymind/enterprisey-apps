import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as NotesActions from './notes.actions';
import * as NotesFeature from './notes.reducer';
import * as NotesSelectors from './notes.selectors';

@Injectable()
export class NotesFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(NotesSelectors.selectNotesLoaded));
  allNotes$ = this.store.pipe(select(NotesSelectors.selectAllNotes));
  selectedNotes$ = this.store.pipe(select(NotesSelectors.selectEntity));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(NotesActions.initNotes());
  }
}
