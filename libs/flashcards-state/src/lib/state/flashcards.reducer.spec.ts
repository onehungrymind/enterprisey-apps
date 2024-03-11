import { Flashcard } from '@proto/api-interfaces';
import { mockEmptyFlashcard, mockFlashcard } from '@proto/testing';

import { FlashcardsActions } from './flashcards.actions';
import {
  FlashcardsState,
  initialFlashcardsState,
  reducer,
} from './flashcards.reducer';

describe('Flashcards Reducer', () => {
  let flashcards: Flashcard[];

  beforeEach(() => {
    flashcards = [
      { ...mockFlashcard, id: '0' },
      { ...mockFlashcard, id: '1' },
      { ...mockFlashcard, id: '2' },
    ];
  });

  describe('valid Flashcards actions', () => {
    it('loadFlashcards should set loaded to false', () => {
      const action = FlashcardsActions.loadFlashcards();
      const expectedState = {
        ...initialFlashcardsState,
        error: null,
      };

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('loadFlashcardsSuccess should set the list of known Flashcards', () => {
      const action = FlashcardsActions.loadFlashcardsSuccess({ flashcards });
      const expectedState = {
        ...initialFlashcardsState,
        loaded: true,
        entities: {
          0: flashcards[0],
          1: flashcards[1],
          2: flashcards[2],
        },
        ids: flashcards.map((flashcard) => flashcard.id),
      };

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('loadFlashcardsFailure should set error to error', () => {
      const error = new Error();
      const action = FlashcardsActions.loadFlashcardsFailure({ error });
      const expectedState = {
        ...initialFlashcardsState,
        error,
      };

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('loadFlashcard should set loaded to false', () => {
      const action = FlashcardsActions.loadFlashcard({
        flashcardId: mockFlashcard.id as string,
      });
      const expectedState = {
        ...initialFlashcardsState,
        loaded: false,
        error: null,
      };

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('loadFlashcardSuccess should set loaded to true', () => {
      const action = FlashcardsActions.loadFlashcardSuccess({
        flashcard: mockFlashcard,
      });
      const expectedState = {
        ...initialFlashcardsState,
        loaded: true,
        entities: {
          0: mockFlashcard,
        },
        ids: [mockFlashcard.id],
      };

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('loadFlashcardFailure should set error to error', () => {
      const error = new Error();
      const action = FlashcardsActions.loadFlashcardFailure({ error });
      const expectedState = {
        ...initialFlashcardsState,
        error,
      };

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('updateFlashcardSuccess should modify flashcard', () => {
      const prepAction = FlashcardsActions.loadFlashcardSuccess({
        flashcard: { ...mockEmptyFlashcard, id: mockFlashcard.id },
      });
      const prepState: FlashcardsState = reducer(
        initialFlashcardsState,
        prepAction
      );

      const expectedState = {
        ...initialFlashcardsState,
        loaded: true,
        entities: {
          0: mockFlashcard,
        },
        ids: [mockFlashcard.id],
      };

      const action = FlashcardsActions.updateFlashcardSuccess({
        flashcard: mockFlashcard,
      });
      const result: FlashcardsState = reducer(prepState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('updateFlashcardFailure should set error to error', () => {
      const error = new Error();
      const action = FlashcardsActions.updateFlashcardFailure({ error });
      const expectedState = {
        ...initialFlashcardsState,
        error: error,
      };

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('createFlashcardSuccess should add flashcard', () => {
      const action = FlashcardsActions.createFlashcardSuccess({
        flashcard: mockFlashcard,
      });
      const expectedState = {
        ...initialFlashcardsState,
        loaded: false,
        entities: {
          0: mockFlashcard,
        },
        ids: [mockFlashcard.id],
      };

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('createFlashcardFailure should set error to error', () => {
      const error = new Error();
      const action = FlashcardsActions.createFlashcardFailure({ error });
      const expectedState = {
        ...initialFlashcardsState,
        error,
      };

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('deleteFlashcardSuccess should add flashcard', () => {
      const prepAction = FlashcardsActions.loadFlashcardSuccess({
        flashcard: mockFlashcard,
      });
      const prepState: FlashcardsState = reducer(
        initialFlashcardsState,
        prepAction
      );

      const expectedState = {
        ...initialFlashcardsState,
        loaded: true,
      };

      const action = FlashcardsActions.deleteFlashcardSuccess({
        flashcard: mockFlashcard,
      });
      const result: FlashcardsState = reducer(prepState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('deleteFlashcardFailure should set error to error', () => {
      const error = new Error();
      const action = FlashcardsActions.deleteFlashcardFailure({ error });
      const expectedState = {
        ...initialFlashcardsState,
        error,
      };

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('selectFlashcard should set selectedId', () => {
      const action = FlashcardsActions.selectFlashcard({
        selectedId: mockFlashcard.id as string,
      });
      const expectedState = {
        ...initialFlashcardsState,
        selectedId: mockFlashcard.id,
      };

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('resetSelectedFlashcard should reset selectedId', () => {
      const prepAction = FlashcardsActions.selectFlashcard({
        selectedId: mockFlashcard.id as string,
      });
      const prepState = reducer(initialFlashcardsState, prepAction);

      const action = FlashcardsActions.resetSelectedFlashcard();
      const expectedState = {
        ...initialFlashcardsState,
        selectedId: null,
      };

      const result: FlashcardsState = reducer(prepState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('resetFlashcards should reset flashcards', () => {
      const prepAction = FlashcardsActions.loadFlashcardsSuccess({
        flashcards,
      });
      const prepState: FlashcardsState = reducer(
        initialFlashcardsState,
        prepAction
      );

      const expectedState = {
        ...initialFlashcardsState,
        loaded: true,
      };

      const action = FlashcardsActions.resetFlashcards();
      const result: FlashcardsState = reducer(prepState, action);

      expect(result).toStrictEqual(expectedState);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result: FlashcardsState = reducer(initialFlashcardsState, action);

      expect(result).toBe(initialFlashcardsState);
    });
  });
});
