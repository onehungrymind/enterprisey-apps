import { Action } from '@ngrx/store';

import * as FlashcardsActions from './flashcards.actions';
import { FlashcardsEntity } from './flashcards.models';
import {
  FlashcardsState,
  initialFlashcardsState,
  flashcardsReducer,
} from './flashcards.reducer';

describe('Flashcards Reducer', () => {
  const createFlashcardsEntity = (id: string, name = ''): FlashcardsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Flashcards actions', () => {
    it('loadFlashcardsSuccess should return the list of known Flashcards', () => {
      const flashcards = [
        createFlashcardsEntity('PRODUCT-AAA'),
        createFlashcardsEntity('PRODUCT-zzz'),
      ];
      const action = FlashcardsActions.loadFlashcardsSuccess({ flashcards });

      const result: FlashcardsState = flashcardsReducer(
        initialFlashcardsState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = flashcardsReducer(initialFlashcardsState, action);

      expect(result).toBe(initialFlashcardsState);
    });
  });
});
