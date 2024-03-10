import { Injectable, inject } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { Note } from '@proto/api-interfaces';
import { NotesActions } from './notes.actions';
import * as NotesSelectors from './notes.selectors';

@Injectable({
  providedIn: 'root',
})
export class NotesFacade {
  private readonly store = inject(Store);

  loaded$ = this.store.pipe(select(NotesSelectors.getNotesLoaded));
  allNotes$ = this.store.pipe(select(NotesSelectors.getAllNotes));
  selectedNote$ = this.store.pipe(select(NotesSelectors.getSelectedNote));

  resetSelectedNote() {
    this.dispatch(NotesActions.resetSelectedNote());
  }

  selectNote(selectedId: string) {
    this.dispatch(NotesActions.selectNote({ selectedId }));
  }

  loadNotes() {
    this.dispatch(NotesActions.loadNotes());
  }

  loadNote(noteId: string) {
    this.dispatch(NotesActions.loadNote({ noteId }));
  }

  saveNote(note: Note) {
    if (note.id) {
      this.updateNote(note);
    } else {
      this.createNote(note);
    }
  }

  createNote(note: Note) {
    this.dispatch(NotesActions.createNote({ note }));
  }

  updateNote(note: Note) {
    this.dispatch(NotesActions.updateNote({ note }));
  }

  deleteNote(note: Note) {
    this.dispatch(NotesActions.deleteNote({ note }));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
