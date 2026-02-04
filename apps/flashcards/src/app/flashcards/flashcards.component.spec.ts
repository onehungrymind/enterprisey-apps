import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { FlashcardsFacade } from '@proto/flashcards-state';
import { mockEmptyFlashcard, mockFlashcard } from '@proto/testing';
import { FlashcardsComponent } from './flashcards.component';
describe('FlashcardsComponent', () => {
  let component: FlashcardsComponent;
  let fixture: ComponentFixture<FlashcardsComponent>;
  let de: DebugElement;
  let flashcardsFacade: FlashcardsFacade;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardsComponent, NoopAnimationsModule],
      providers: [provideMockStore({})],
    }).compileComponents();
    fixture = TestBed.createComponent(FlashcardsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    flashcardsFacade = TestBed.inject(FlashcardsFacade);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should on select call flashcardsFacade selectFlashcard', () => {
    const spy = jest.spyOn(flashcardsFacade, 'selectFlashcard');
    component.selectFlashcard(mockFlashcard);
    expect(spy).toHaveBeenCalledWith(mockFlashcard.id);
  });
  describe('should on save call FlashcardsFacade', () => {
    it('updateFlashcard', () => {
      const spy = jest.spyOn(flashcardsFacade, 'updateFlashcard');
      component.saveFlashcard(mockFlashcard);
      expect(spy).toHaveBeenCalledWith(mockFlashcard);
    });
    it('createFlashcard', () => {
      const spy = jest.spyOn(flashcardsFacade, 'createFlashcard');
      component.saveFlashcard(mockEmptyFlashcard);
      expect(spy).toHaveBeenCalledWith(mockEmptyFlashcard);
    });
  });
  it('should on delete call FlashcardsFacade deleteFlashcard', () => {
    const spy = jest.spyOn(flashcardsFacade, 'deleteFlashcard');
    component.deleteFlashcard(mockFlashcard);
    expect(spy).toHaveBeenCalledWith(mockFlashcard);
  });
});
