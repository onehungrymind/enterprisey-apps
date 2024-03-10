import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengesComponent } from '../challenges/challenges.component';

@Component({
  standalone: true,
  imports: [CommonModule, ChallengesComponent],
  selector: 'proto-challenges-entry',
  template: `<proto-challenges></proto-challenges>`,
})
export class RemoteEntryComponent {}
