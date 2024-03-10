import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromNotes from './notes.reducer';

export const NOTES_FEATURE_KEY = 'notes';

export interface State {
  notes: fromNotes.NotesState;
}

export const reducers: ActionReducerMap<State> = {
  notes: fromNotes.reducer,
};

export const getNotesState = createFeatureSelector<State>(NOTES_FEATURE_KEY);
