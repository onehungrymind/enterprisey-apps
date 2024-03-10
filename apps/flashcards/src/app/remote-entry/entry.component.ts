import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardsComponent } from '../flashcards/flashcards.component';

@Component({
  standalone: true,
  imports: [CommonModule, FlashcardsComponent],
  selector: 'proto-flashcards-entry',
  template: `<proto-flashcards></proto-flashcards>`,
})
export class RemoteEntryComponent {}
