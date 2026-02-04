import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'proto-ingress-entry',
  template: `<router-outlet />`,
})
export class RemoteEntryComponent {}
