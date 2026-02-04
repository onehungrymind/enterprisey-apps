import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Feature } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';
import { FeaturesFacade } from '@proto/features-state';
import { Observable, filter } from 'rxjs';
import { FeatureDetailsComponent } from './feature-details/feature-details.component';
import { FeaturesListComponent } from './features-list/features-list.component';

@Component({
    selector: 'proto-features',
    imports: [
        CommonModule,
        MaterialModule,
        FeaturesListComponent,
        FeatureDetailsComponent,
    ],
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
  features$: Observable<Feature[]> = this.featuresFacade.allFeatures$;
  selectedFeature$: Observable<Feature> =
    this.featuresFacade.selectedFeature$.pipe(
      filter(
        (feature): feature is Feature => feature !== undefined && feature !== ''
      )
    );

  constructor(private featuresFacade: FeaturesFacade) {}

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.loadFeatures();
    this.featuresFacade.resetSelectedFeature();
  }

  selectFeature(feature: Feature) {
    this.featuresFacade.selectFeature(feature.id as string);
  }

  loadFeatures() {
    this.featuresFacade.loadFeatures();
  }

  saveFeature(feature: Feature) {
    this.featuresFacade.saveFeature(feature);
  }

  deleteFeature(feature: Feature) {
    this.featuresFacade.deleteFeature(feature);
  }
}
