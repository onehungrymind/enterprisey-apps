import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromFeatures from './features.reducer';

export const FEATURES_FEATURE_KEY = 'features';

export interface State {
  features: fromFeatures.FeaturesState;
}

export const reducers: ActionReducerMap<State> = {
  features: fromFeatures.reducer,
};

export const getFeaturesState =
  createFeatureSelector<State>(FEATURES_FEATURE_KEY);
