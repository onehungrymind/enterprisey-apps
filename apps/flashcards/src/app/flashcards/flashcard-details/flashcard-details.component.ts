import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Flashcard } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-flashcard-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './flashcard-details.component.html',
  styleUrls: ['./flashcard-details.component.scss'],
})
export class FlashcardDetailsComponent {
  currentFlashcard!: Flashcard;
  originalTitle = '';
  @Input() set flashcard(value: Flashcard | null) {
    if (value) this.originalTitle = `${value.title}`;
    this.currentFlashcard = Object.assign({}, value);
  }
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();
}
