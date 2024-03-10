import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Challenge } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-challenges-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './challenges-list.component.html',
  styleUrls: ['./challenges-list.component.scss'],
})
export class ChallengesListComponent {
  @Input() challenges: Challenge[] = [];
  @Input() readonly = false;
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}
