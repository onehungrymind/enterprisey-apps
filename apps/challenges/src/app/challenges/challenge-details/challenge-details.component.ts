import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Challenge } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
    selector: 'proto-challenge-details',
    imports: [CommonModule, MaterialModule, FormsModule],
    templateUrl: './challenge-details.component.html',
    styleUrls: ['./challenge-details.component.scss']
})
export class ChallengeDetailsComponent {
  currentChallenge!: Challenge;
  originalTitle = '';
  @Input() set challenge(value: Challenge | null) {
    if (value) this.originalTitle = `${value.title}`;
    this.currentChallenge = Object.assign({}, value);
  }
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();
}
