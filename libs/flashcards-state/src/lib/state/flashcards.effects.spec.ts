import { Flashcard } from '@proto/api-interfaces';
import { FlashcardsService } from '@proto/flashcards-data';
import { mockFlashcard, mockFlashcardsService } from '@proto/testing';
import { of, throwError } from 'rxjs';

import { FlashcardsActions } from './flashcards.actions';
import * as FlashcardsEffects from './flashcards.effects';

describe('FlashcardsEffects', () => {
  const service = mockFlashcardsService as unknown as FlashcardsService;

  describe('loadFlashcards$', () => {
    it('should return loadFlashcardsSuccess, on success', (done) => {
      const flashcards: Flashcard[] = [];
      const action$ = of(FlashcardsActions.loadFlashcards());

      service.all = jest.fn(() => of(flashcards));

      FlashcardsEffects.loadFlashcards(action$, service).subscribe((action) => {
        expect(action).toEqual(
          FlashcardsActions.loadFlashcardsSuccess({ flashcards })
        );
        done();
      });
    });

    it('should return loadFlashcardsFailure, on failure', (done) => {
      const error = new Error();
      const action$ = of(FlashcardsActions.loadFlashcards());

      service.all = jest.fn(() => throwError(() => error));

      FlashcardsEffects.loadFlashcards(action$, service).subscribe((action) => {
        expect(action).toEqual(
          FlashcardsActions.loadFlashcardsFailure({ error })
        );
        done();
      });
    });
  });

  describe('loadFlashcard$', () => {
    it('should return success with flashcard', (done) => {
      const flashcard = { ...mockFlashcard };
      const action$ = of(
        FlashcardsActions.loadFlashcard({ flashcardId: flashcard.id as string })
      );

      service.find = jest.fn(() => of(flashcard));

      FlashcardsEffects.loadFlashcard(action$, service).subscribe((action) => {
        expect(action).toEqual(
          FlashcardsActions.loadFlashcardSuccess({ flashcard })
        );
        done();
      });
    });

    it('should return failure', (done) => {
      const error = new Error();
      const flashcard = { ...mockFlashcard };
      const action$ = of(
        FlashcardsActions.loadFlashcard({ flashcardId: flashcard.id as string })
      );

      service.find = jest.fn(() => throwError(() => error));

      FlashcardsEffects.loadFlashcard(action$, service).subscribe((action) => {
        expect(action).toEqual(
          FlashcardsActions.loadFlashcardFailure({ error })
        );
        done();
      });
    });
  });

  describe('createFlashcard$', () => {
    it('should return success with flashcard', (done) => {
      const flashcard = { ...mockFlashcard };
      const action$ = of(FlashcardsActions.createFlashcard({ flashcard }));

      mockFlashcardsService.create = jest.fn(() => of(flashcard));

      FlashcardsEffects.createFlashcard(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            FlashcardsActions.createFlashcardSuccess({ flashcard })
          );
          done();
        }
      );
    });

    it('should return failure', (done) => {
      const error = new Error();
      const flashcard = { ...mockFlashcard };
      const action$ = of(FlashcardsActions.createFlashcard({ flashcard }));

      service.create = jest.fn(() => throwError(() => error));

      FlashcardsEffects.createFlashcard(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            FlashcardsActions.createFlashcardFailure({ error })
          );
          done();
        }
      );
    });
  });

  describe('updateFlashcard$', () => {
    it('should return success with flashcard', (done) => {
      const flashcard = { ...mockFlashcard };
      const action$ = of(FlashcardsActions.updateFlashcard({ flashcard }));

      mockFlashcardsService.update = jest.fn(() => of(flashcard));

      FlashcardsEffects.updateFlashcard(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            FlashcardsActions.updateFlashcardSuccess({ flashcard })
          );
          done();
        }
      );
    });

    it('should return failure', (done) => {
      const error = new Error();
      const flashcard = { ...mockFlashcard };
      const action$ = of(FlashcardsActions.updateFlashcard({ flashcard }));

      service.update = jest.fn(() => throwError(() => error));

      FlashcardsEffects.updateFlashcard(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            FlashcardsActions.updateFlashcardFailure({ error })
          );
          done();
        }
      );
    });
  });

  describe('deleteFlashcard$', () => {
    it('should return success with flashcard', (done) => {
      const flashcard = { ...mockFlashcard };
      const action$ = of(FlashcardsActions.deleteFlashcard({ flashcard }));

      mockFlashcardsService.delete = jest.fn(() => of(flashcard));

      FlashcardsEffects.deleteFlashcard(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            FlashcardsActions.deleteFlashcardSuccess({ flashcard })
          );
          done();
        }
      );
    });

    it('should return failure', (done) => {
      const error = new Error();
      const flashcard = { ...mockFlashcard };
      const action$ = of(FlashcardsActions.deleteFlashcard({ flashcard }));

      service.delete = jest.fn(() => throwError(() => error));

      FlashcardsEffects.deleteFlashcard(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            FlashcardsActions.deleteFlashcardFailure({ error })
          );
          done();
        }
      );
    });
  });
});
