import { Injectable, inject } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { Feature } from '@proto/api-interfaces';
import { FeaturesActions } from './features.actions';
import * as FeaturesSelectors from './features.selectors';

@Injectable({
  providedIn: 'root',
})
export class FeaturesFacade {
  private readonly store = inject(Store);

  loaded$ = this.store.pipe(select(FeaturesSelectors.getFeaturesLoaded));
  allFeatures$ = this.store.pipe(select(FeaturesSelectors.getAllFeatures));
  selectedFeature$ = this.store.pipe(
    select(FeaturesSelectors.getSelectedFeature)
  );

  resetSelectedFeature() {
    this.dispatch(FeaturesActions.resetSelectedFeature());
  }

  selectFeature(selectedId: string) {
    this.dispatch(FeaturesActions.selectFeature({ selectedId }));
  }

  loadFeatures() {
    this.dispatch(FeaturesActions.loadFeatures());
  }

  loadFeature(featureId: string) {
    this.dispatch(FeaturesActions.loadFeature({ featureId }));
  }

  saveFeature(feature: Feature) {
    if (feature.id) {
      this.updateFeature(feature);
    } else {
      this.createFeature(feature);
    }
  }

  createFeature(feature: Feature) {
    this.dispatch(FeaturesActions.createFeature({ feature }));
  }

  updateFeature(feature: Feature) {
    this.dispatch(FeaturesActions.updateFeature({ feature }));
  }

  deleteFeature(feature: Feature) {
    this.dispatch(FeaturesActions.deleteFeature({ feature }));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
