import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Note } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';
import { NotesFacade } from '@proto/notes-state';
import { Observable, filter } from 'rxjs';
import { NoteDetailsComponent } from './note-details/note-details.component';
import { NotesListComponent } from './notes-list/notes-list.component';

@Component({
  selector: 'proto-notes',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    NotesListComponent,
    NoteDetailsComponent,
  ],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  notes$: Observable<Note[]> = this.notesFacade.allNotes$;
  selectedNote$: Observable<Note> = this.notesFacade.selectedNote$.pipe(
    filter((note): note is Note => note !== undefined && note !== '')
  );

  constructor(private notesFacade: NotesFacade) {}

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.loadNotes();
    this.notesFacade.resetSelectedNote();
  }

  selectNote(note: Note) {
    this.notesFacade.selectNote(note.id as string);
  }

  loadNotes() {
    this.notesFacade.loadNotes();
  }

  saveNote(note: Note) {
    this.notesFacade.saveNote(note);
  }

  deleteNote(note: Note) {
    this.notesFacade.deleteNote(note);
  }
}
