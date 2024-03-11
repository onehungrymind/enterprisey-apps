import { createSelector } from '@ngrx/store';
import { getFeaturesState } from './state';
import { FeaturesState, featuresAdapter } from './features.reducer';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = featuresAdapter.getSelectors();

const getFeaturesSlice = createSelector(getFeaturesState, (state) => state.features);

export const getFeatureIds = createSelector(getFeaturesSlice, selectIds);
export const getFeaturesEntities = createSelector(getFeaturesSlice, selectEntities);
export const getAllFeatures = createSelector(getFeaturesSlice, selectAll);
export const getFeaturesTotal = createSelector(getFeaturesSlice, selectTotal);
export const getSelectedFeatureId = createSelector(getFeaturesSlice, (state: FeaturesState) => state.selectedId);

export const getFeaturesLoaded = createSelector(
  getFeaturesSlice,
  (state: FeaturesState) => state.loaded
);

export const getFeaturesError = createSelector(
  getFeaturesSlice,
  (state: FeaturesState) => state.error
);

export const getSelectedFeature = createSelector(
  getFeaturesEntities,
  getSelectedFeatureId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
