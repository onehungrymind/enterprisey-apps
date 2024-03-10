import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Flashcard } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';
import { FlashcardsFacade } from '@proto/flashcards-state';
import { Observable, filter } from 'rxjs';
import { FlashcardDetailsComponent } from './flashcard-details/flashcard-details.component';
import { FlashcardsListComponent } from './flashcards-list/flashcards-list.component';

@Component({
  selector: 'proto-flashcards',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FlashcardsListComponent,
    FlashcardDetailsComponent,
  ],
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.scss'],
})
export class FlashcardsComponent implements OnInit {
  flashcards$: Observable<Flashcard[]> = this.flashcardsFacade.allFlashcards$;
  selectedFlashcard$: Observable<Flashcard> = this.flashcardsFacade.selectedFlashcard$.pipe(
    filter((flashcard): flashcard is Flashcard => flashcard !== undefined && flashcard !== '')
  );

  constructor(private flashcardsFacade: FlashcardsFacade) {}

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.loadFlashcards();
    this.flashcardsFacade.resetSelectedFlashcard();
  }

  selectFlashcard(flashcard: Flashcard) {
    this.flashcardsFacade.selectFlashcard(flashcard.id as string);
  }

  loadFlashcards() {
    this.flashcardsFacade.loadFlashcards();
  }

  saveFlashcard(flashcard: Flashcard) {
    this.flashcardsFacade.saveFlashcard(flashcard);
  }

  deleteFlashcard(flashcard: Flashcard) {
    this.flashcardsFacade.deleteFlashcard(flashcard);
  }
}
