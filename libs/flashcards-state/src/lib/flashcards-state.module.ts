import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromFlashcards from './state/flashcards.reducer';
import { FlashcardsEffects } from './state/flashcards.effects';
import { FlashcardsFacade } from './state/flashcards.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromFlashcards.FLASHCARDS_FEATURE_KEY,
      fromFlashcards.flashcardsReducer
    ),
    EffectsModule.forFeature([FlashcardsEffects]),
  ],
  providers: [FlashcardsFacade],
})
export class FlashcardsStateModule {}
