import { Injectable, inject } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { Flashcard } from '@proto/api-interfaces';
import { FlashcardsActions } from './flashcards.actions';
import * as FlashcardsSelectors from './flashcards.selectors';

@Injectable({
  providedIn: 'root',
})
export class FlashcardsFacade {
  private readonly store = inject(Store);

  loaded$ = this.store.pipe(select(FlashcardsSelectors.getFlashcardsLoaded));
  allFlashcards$ = this.store.pipe(select(FlashcardsSelectors.getAllFlashcards));
  selectedFlashcard$ = this.store.pipe(select(FlashcardsSelectors.getSelectedFlashcard));

  resetSelectedFlashcard() {
    this.dispatch(FlashcardsActions.resetSelectedFlashcard());
  }

  selectFlashcard(selectedId: string) {
    this.dispatch(FlashcardsActions.selectFlashcard({ selectedId }));
  }

  loadFlashcards() {
    this.dispatch(FlashcardsActions.loadFlashcards());
  }

  loadFlashcard(flashcardId: string) {
    this.dispatch(FlashcardsActions.loadFlashcard({ flashcardId }));
  }

  saveFlashcard(flashcard: Flashcard) {
    if (flashcard.id) {
      this.updateFlashcard(flashcard);
    } else {
      this.createFlashcard(flashcard);
    }
  }

  createFlashcard(flashcard: Flashcard) {
    this.dispatch(FlashcardsActions.createFlashcard({ flashcard }));
  }

  updateFlashcard(flashcard: Flashcard) {
    this.dispatch(FlashcardsActions.updateFlashcard({ flashcard }));
  }

  deleteFlashcard(flashcard: Flashcard) {
    this.dispatch(FlashcardsActions.deleteFlashcard({ flashcard }));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
