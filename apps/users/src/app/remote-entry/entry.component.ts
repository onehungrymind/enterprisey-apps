import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from '../users/users.component';

@Component({
  standalone: true,
  imports: [CommonModule, UsersComponent],
  selector: 'proto-users-entry',
  template: `<proto-users></proto-users>`,
})
export class RemoteEntryComponent {}
