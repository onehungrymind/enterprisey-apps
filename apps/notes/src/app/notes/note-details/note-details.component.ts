import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Note } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
    selector: 'proto-note-details',
    imports: [CommonModule, MaterialModule, FormsModule],
    templateUrl: './note-details.component.html',
    styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent {
  currentNote!: Note;
  originalTitle = '';
  @Input() set note(value: Note | null) {
    if (value) this.originalTitle = `${value.title}`;
    this.currentNote = Object.assign({}, value);
  }
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();
}
