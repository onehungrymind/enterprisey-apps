import { Component } from '@angular/core';

import { FlashcardsComponent } from '../flashcards/flashcards.component';

@Component({
    imports: [FlashcardsComponent],
    selector: 'proto-flashcards-entry',
    template: `<proto-flashcards></proto-flashcards>`
})
export class RemoteEntryComponent {}
