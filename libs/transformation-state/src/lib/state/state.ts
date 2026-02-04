import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromPipelines from './pipelines.reducer';

export const PIPELINES_FEATURE_KEY = 'transformation';

export interface State {
  pipelines: fromPipelines.PipelinesState;
}

export const reducers: ActionReducerMap<State> = {
  pipelines: fromPipelines.reducer,
};

export const getTransformationState = createFeatureSelector<State>(PIPELINES_FEATURE_KEY);
