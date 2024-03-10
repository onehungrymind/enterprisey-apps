import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Note } from '@proto/api-interfaces';
import { NotesActions } from './notes.actions';

export interface NotesState extends EntityState<Note> {
  selectedId?: string | undefined;
  error?: string | null;
  loaded: boolean;
}

export const notesAdapter: EntityAdapter<Note> = createEntityAdapter<Note>();

export const initialNotesState: NotesState = notesAdapter.getInitialState({
  loaded: false,
});

const onFailure = (state: NotesState, { error }: any) => ({ ...state, error });

export const reducer = createReducer(
  initialNotesState,
  // TBD
  on(NotesActions.loadNotes, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(NotesActions.loadNote, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  // RESET
  on(NotesActions.selectNote, (state, { selectedId }) =>
    Object.assign({}, state, { selectedId })
  ),
  on(NotesActions.resetSelectedNote, (state) =>
    Object.assign({}, state, { selectedId: null })
  ),
  on(NotesActions.resetNotes, (state) => notesAdapter.removeAll(state)),
  // CRUD
  on(NotesActions.loadNotesSuccess, (state, { notes }) =>
    notesAdapter.setAll(notes, { ...state, loaded: true })
  ),
  on(NotesActions.loadNoteSuccess, (state, { note }) =>
    notesAdapter.upsertOne(note, { ...state, loaded: true })
  ),
  on(NotesActions.createNoteSuccess, (state, { note }) =>
    notesAdapter.addOne(note, state)
  ),
  on(NotesActions.updateNoteSuccess, (state, { note }) =>
    notesAdapter.updateOne({ id: note.id || '', changes: note }, state)
  ),
  on(NotesActions.deleteNoteSuccess, (state, { note }) =>
    notesAdapter.removeOne(note?.id ?? '', state)
  ),
  // FAILURE
  on(
    NotesActions.loadNotesFailure,
    NotesActions.loadNoteFailure,
    NotesActions.createNoteFailure,
    NotesActions.createNoteFailure,
    NotesActions.createNoteFailure,
    onFailure
  )
);
