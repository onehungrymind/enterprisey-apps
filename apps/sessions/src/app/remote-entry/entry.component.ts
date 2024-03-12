import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [CommonModule, NxWelcomeComponent],
  selector: 'proto-sessions-entry',
  template: `<proto-nx-welcome></proto-nx-welcome>`,
})
export class RemoteEntryComponent {}
