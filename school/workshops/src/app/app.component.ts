import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { WorkshopsFacade } from '@proto/workshops-state'
@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'proto-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'workshops';

  constructor(private workshopsFacade: WorkshopsFacade) {}

  ngOnInit(): void {
    this.workshopsFacade.loadWorkshops();
  }
}
