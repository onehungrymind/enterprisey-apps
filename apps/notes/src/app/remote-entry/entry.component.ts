import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesComponent } from '../notes/notes.component';

@Component({
  standalone: true,
  imports: [CommonModule, NotesComponent],
  selector: 'proto-notes-entry',
  template: `<proto-notes></proto-notes>`,
})
export class RemoteEntryComponent {}
