import { Component } from '@angular/core';

import { NotesComponent } from '../notes/notes.component';

@Component({
    imports: [NotesComponent],
    selector: 'proto-notes-entry',
    template: `<proto-notes></proto-notes>`
})
export class RemoteEntryComponent {}
