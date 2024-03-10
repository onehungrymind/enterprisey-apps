import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as NotesActions from './notes.actions';
import { NotesEntity } from './notes.models';

export const NOTES_FEATURE_KEY = 'notes';

export interface NotesState extends EntityState<NotesEntity> {
  selectedId?: string | number; // which Notes record has been selected
  loaded: boolean; // has the Notes list been loaded
  error?: string | null; // last known error (if any)
}

export interface NotesPartialState {
  readonly [NOTES_FEATURE_KEY]: NotesState;
}

export const notesAdapter: EntityAdapter<NotesEntity> =
  createEntityAdapter<NotesEntity>();

export const initialNotesState: NotesState = notesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialNotesState,
  on(NotesActions.initNotes, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(NotesActions.loadNotesSuccess, (state, { notes }) =>
    notesAdapter.setAll(notes, { ...state, loaded: true })
  ),
  on(NotesActions.loadNotesFailure, (state, { error }) => ({ ...state, error }))
);

export function notesReducer(state: NotesState | undefined, action: Action) {
  return reducer(state, action);
}
