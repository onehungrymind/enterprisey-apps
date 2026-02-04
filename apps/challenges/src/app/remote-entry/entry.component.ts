import { Component } from '@angular/core';

import { ChallengesComponent } from '../challenges/challenges.component';

@Component({
    imports: [ChallengesComponent],
    selector: 'proto-challenges-entry',
    template: `<proto-challenges></proto-challenges>`
})
export class RemoteEntryComponent {}
