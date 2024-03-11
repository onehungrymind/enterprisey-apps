import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeaturesComponent } from './features/features.component';

@Component({
  standalone: true,
  imports: [FeaturesComponent, RouterModule],
  selector: 'proto-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'portal';
}
