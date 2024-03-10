import { FlashcardsEntity } from './flashcards.models';
import {
  flashcardsAdapter,
  FlashcardsPartialState,
  initialFlashcardsState,
} from './flashcards.reducer';
import * as FlashcardsSelectors from './flashcards.selectors';

describe('Flashcards Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getFlashcardsId = (it: FlashcardsEntity) => it.id;
  const createFlashcardsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as FlashcardsEntity);

  let state: FlashcardsPartialState;

  beforeEach(() => {
    state = {
      flashcards: flashcardsAdapter.setAll(
        [
          createFlashcardsEntity('PRODUCT-AAA'),
          createFlashcardsEntity('PRODUCT-BBB'),
          createFlashcardsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialFlashcardsState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Flashcards Selectors', () => {
    it('selectAllFlashcards() should return the list of Flashcards', () => {
      const results = FlashcardsSelectors.selectAllFlashcards(state);
      const selId = getFlashcardsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = FlashcardsSelectors.selectEntity(
        state
      ) as FlashcardsEntity;
      const selId = getFlashcardsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectFlashcardsLoaded() should return the current "loaded" status', () => {
      const result = FlashcardsSelectors.selectFlashcardsLoaded(state);

      expect(result).toBe(true);
    });

    it('selectFlashcardsError() should return the current "error" state', () => {
      const result = FlashcardsSelectors.selectFlashcardsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
