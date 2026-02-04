import { Flashcard } from '@proto/api-interfaces';
import { mockFlashcard } from '@proto/testing';
import {
  flashcardsAdapter,
  FlashcardsState,
  initialFlashcardsState,
} from './flashcards.reducer';
import * as FlashcardsSelectors from './flashcards.selectors';
describe('Flashcards Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getFlashcardsId = (flashcard: Flashcard) => flashcard['id'];
  const createFlashcard = (id: string, name = '') =>
    ({ ...mockFlashcard, id: id } as Flashcard);
  let state: FlashcardsState;
  beforeEach(() => {
    state = flashcardsAdapter.setAll(
      [
        createFlashcard('PRODUCT-AAA'),
        createFlashcard('PRODUCT-BBB'),
        createFlashcard('PRODUCT-CCC'),
      ],
      {
        ...initialFlashcardsState,
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true,
      }
    );
  });
  describe('Flashcards Selectors', () => {
    it('getAllFlashcards() should return the list of Flashcards', () => {
      const results = FlashcardsSelectors.getAllFlashcards.projector(state);
      const selId = getFlashcardsId(results[1]);
      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });
    it('getSelected() should return the selected schema', () => {
      const result = FlashcardsSelectors.getSelectedFlashcard.projector(
        state.entities,
        state.selectedId
      );
      const selId = getFlashcardsId(result as Flashcard);
      expect(selId).toBe('PRODUCT-BBB');
    });
    it("getFlashcardsLoaded() should return the current 'loaded' status", () => {
      const result = FlashcardsSelectors.getFlashcardsLoaded.projector(state);
      expect(result).toBe(true);
    });
    it("getFlashcardsError() should return the current 'error' state", () => {
      const result = FlashcardsSelectors.getFlashcardsError.projector(state);
      expect(result).toBe(ERROR_MSG);
    });
  });
});
