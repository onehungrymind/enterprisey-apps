import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromWorkshops from './workshops.reducer';

export const WORKSHOPS_FEATURE_KEY = 'workshops';

export interface State {
  workshops: fromWorkshops.WorkshopsState;
}

export const reducers: ActionReducerMap<State> = {
  workshops: fromWorkshops.reducer,
};

export const getWorkshopsState = createFeatureSelector<State>(WORKSHOPS_FEATURE_KEY);
