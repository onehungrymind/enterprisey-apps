import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WizardComponent } from './wizard/wizard.component';

@Component({
  standalone: true,
  imports: [WizardComponent, RouterModule],
  selector: 'proto-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
