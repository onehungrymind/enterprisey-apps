import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Feature } from '@proto/api-interfaces';
import { FeaturesFacade } from '@proto/features-state';
import { Observable } from 'rxjs';

@Component({
    imports: [RouterModule, AsyncPipe],
    selector: 'proto-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  features$: Observable<Feature[]> = this.featuresFacade.allFeatures$;

  constructor(private featuresFacade: FeaturesFacade) {}

  ngOnInit() {
    this.featuresFacade.loadFeatures();
  }
}
