import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromSources from './sources.reducer';

export const SOURCES_FEATURE_KEY = 'ingress';

export interface State {
  sources: fromSources.SourcesState;
}

export const reducers: ActionReducerMap<State> = {
  sources: fromSources.reducer,
};

export const getIngressState = createFeatureSelector<State>(SOURCES_FEATURE_KEY);
