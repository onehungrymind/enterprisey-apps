import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Flashcard } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-flashcards-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './flashcards-list.component.html',
  styleUrls: ['./flashcards-list.component.scss'],
})
export class FlashcardsListComponent {
  @Input() flashcards: Flashcard[] = [];
  @Input() readonly = false;
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
