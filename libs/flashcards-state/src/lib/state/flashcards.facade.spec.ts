import { TestBed } from '@angular/core/testing';
import { ActionsSubject } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { mockFlashcard } from '@proto/testing';
import { FlashcardsActions } from './flashcards.actions';
import { FlashcardsFacade } from './flashcards.facade';
import { initialFlashcardsState } from './flashcards.reducer';
describe('FlashcardsFacade', () => {
  let facade: FlashcardsFacade;
  let store: MockStore;
  const mockActionsSubject = new ActionsSubject();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FlashcardsFacade,
        provideMockStore({ initialState: initialFlashcardsState }),
        { provide: ActionsSubject, useValue: mockActionsSubject },
      ],
    });
    facade = TestBed.inject(FlashcardsFacade);
    store = TestBed.inject(MockStore);
  });
  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
  describe('should dispatch', () => {
    it('select on select(flashcard.id)', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.selectFlashcard(mockFlashcard.id as string);
      const action = FlashcardsActions.selectFlashcard({
        selectedId: mockFlashcard.id as string,
      });
      expect(spy).toHaveBeenCalledWith(action);
    });
    it('loadFlashcards on loadFlashcards()', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.loadFlashcards();
      const action = FlashcardsActions.loadFlashcards();
      expect(spy).toHaveBeenCalledWith(action);
    });
    it('loadFlashcard on loadFlashcard(flashcard.id)', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.loadFlashcard(mockFlashcard.id as string);
      const action = FlashcardsActions.loadFlashcard({
        flashcardId: mockFlashcard.id as string,
      });
      expect(spy).toHaveBeenCalledWith(action);
    });
    it('createFlashcard on createFlashcard(flashcard)', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.createFlashcard(mockFlashcard);
      const action = FlashcardsActions.createFlashcard({
        flashcard: mockFlashcard,
      });
      expect(spy).toHaveBeenCalledWith(action);
    });
    it('updateFlashcard on updateFlashcard(flashcard)', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.updateFlashcard(mockFlashcard);
      const action = FlashcardsActions.updateFlashcard({
        flashcard: mockFlashcard,
      });
      expect(spy).toHaveBeenCalledWith(action);
    });
    it('delete on delete(model)', () => {
      const spy = jest.spyOn(store, 'dispatch');
      facade.deleteFlashcard(mockFlashcard);
      const action = FlashcardsActions.deleteFlashcard({
        flashcard: mockFlashcard,
      });
      expect(spy).toHaveBeenCalledWith(action);
    });
  });
});
