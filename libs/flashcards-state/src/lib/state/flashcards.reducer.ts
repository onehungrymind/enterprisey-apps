import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Flashcard } from '@proto/api-interfaces';
import { FlashcardsActions } from './flashcards.actions';

export interface FlashcardsState extends EntityState<Flashcard> {
  selectedId?: string | undefined;
  error?: string | null;
  loaded: boolean;
}

export const flashcardsAdapter: EntityAdapter<Flashcard> = createEntityAdapter<Flashcard>();

export const initialFlashcardsState: FlashcardsState = flashcardsAdapter.getInitialState({
  loaded: false,
});

const onFailure = (state: FlashcardsState, { error }: any) => ({ ...state, error });

export const reducer = createReducer(
  initialFlashcardsState,
  // TBD
  on(FlashcardsActions.loadFlashcards, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(FlashcardsActions.loadFlashcard, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  // RESET
  on(FlashcardsActions.selectFlashcard, (state, { selectedId }) =>
    Object.assign({}, state, { selectedId })
  ),
  on(FlashcardsActions.resetSelectedFlashcard, (state) =>
    Object.assign({}, state, { selectedId: null })
  ),
  on(FlashcardsActions.resetFlashcards, (state) => flashcardsAdapter.removeAll(state)),
  // CRUD
  on(FlashcardsActions.loadFlashcardsSuccess, (state, { flashcards }) =>
    flashcardsAdapter.setAll(flashcards, { ...state, loaded: true })
  ),
  on(FlashcardsActions.loadFlashcardSuccess, (state, { flashcard }) =>
    flashcardsAdapter.upsertOne(flashcard, { ...state, loaded: true })
  ),
  on(FlashcardsActions.createFlashcardSuccess, (state, { flashcard }) =>
    flashcardsAdapter.addOne(flashcard, state)
  ),
  on(FlashcardsActions.updateFlashcardSuccess, (state, { flashcard }) =>
    flashcardsAdapter.updateOne({ id: flashcard.id || '', changes: flashcard }, state)
  ),
  on(FlashcardsActions.deleteFlashcardSuccess, (state, { flashcard }) =>
    flashcardsAdapter.removeOne(flashcard?.id ?? '', state)
  ),
  // FAILURE
  on(
    FlashcardsActions.loadFlashcardsFailure,
    FlashcardsActions.loadFlashcardFailure,
    FlashcardsActions.createFlashcardFailure,
    FlashcardsActions.createFlashcardFailure,
    FlashcardsActions.createFlashcardFailure,
    onFailure
  )
);
