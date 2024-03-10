import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { User } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-user-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {
  currentUser!: User;
  originalTitle = '';
  @Input() set user(value: User | null) {
    if (value) this.originalTitle = `${value.firstName} ${value.lastName}`;
    this.currentUser = Object.assign({}, value);
  }
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();
}
