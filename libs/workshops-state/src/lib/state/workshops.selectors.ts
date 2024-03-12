import { createSelector } from '@ngrx/store';
import { getWorkshopsState } from './state';
import { WorkshopsState, workshopsAdapter } from './workshops.reducer';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = workshopsAdapter.getSelectors();

const getWorkshopsSlice = createSelector(getWorkshopsState, (state) => state.workshops);

export const getWorkshopIds = createSelector(getWorkshopsSlice, selectIds);
export const getWorkshopsEntities = createSelector(getWorkshopsSlice, selectEntities);
export const getAllWorkshops = createSelector(getWorkshopsSlice, selectAll);
export const getWorkshopsTotal = createSelector(getWorkshopsSlice, selectTotal);
export const getSelectedWorkshopId = createSelector(getWorkshopsSlice, (state: WorkshopsState) => state.selectedId);

export const getWorkshopsLoaded = createSelector(
  getWorkshopsSlice,
  (state: WorkshopsState) => state.loaded
);

export const getWorkshopsError = createSelector(
  getWorkshopsSlice,
  (state: WorkshopsState) => state.error
);

export const getSelectedWorkshop = createSelector(
  getWorkshopsEntities,
  getSelectedWorkshopId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
