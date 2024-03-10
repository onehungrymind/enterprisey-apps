import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Flashcard } from '@proto/api-interfaces';

export const FlashcardsActions = createActionGroup({
  source: 'Flashcards API',
  events: {
    'Select Flashcard': props<{ selectedId: string }>(),
    'Reset Selected Flashcard': emptyProps(),
    'Reset Flashcards': emptyProps(),
    'Load Flashcards': emptyProps(),
    'Load Flashcards Success': props<{ flashcards: Flashcard[] }>(),
    'Load Flashcards Failure': props<{ error: any }>(),
    'Load Flashcard': props<{ flashcardId: string }>(),
    'Load Flashcard Success': props<{ flashcard: Flashcard }>(),
    'Load Flashcard Failure': props<{ error: any }>(),
    'Create Flashcard': props<{ flashcard: Flashcard }>(),
    'Create Flashcard Success': props<{ flashcard: Flashcard }>(),
    'Create Flashcard Failure': props<{ error: any }>(),
    'Update Flashcard': props<{ flashcard: Flashcard }>(),
    'Update Flashcard Success': props<{ flashcard: Flashcard }>(),
    'Update Flashcard Failure': props<{ error: any }>(),
    'Delete Flashcard': props<{ flashcard: Flashcard }>(),
    'Delete Flashcard Success': props<{ flashcard: Flashcard }>(),
    'Delete Flashcard Failure': props<{ error: any }>(),
    'Delete Flashcard Cancelled': emptyProps(),
    'Upsert Flashcard': props<{ flashcard: Flashcard }>(),
    'Upsert Flashcard Success': props<{ flashcard: Flashcard }>(),
    'Upsert Flashcard Failure': props<{ error: any }>(),
  }
});
