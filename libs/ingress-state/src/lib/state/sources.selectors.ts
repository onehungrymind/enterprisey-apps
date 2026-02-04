import { createSelector } from '@ngrx/store';
import { getIngressState } from './state';
import { SourcesState, sourcesAdapter } from './sources.reducer';

const { selectIds, selectEntities, selectAll, selectTotal } = sourcesAdapter.getSelectors();

const getSourcesSlice = createSelector(getIngressState, (state) => state.sources);

export const getSourceIds = createSelector(getSourcesSlice, selectIds);
export const getSourcesEntities = createSelector(getSourcesSlice, selectEntities);
export const getAllSources = createSelector(getSourcesSlice, selectAll);
export const getSourcesTotal = createSelector(getSourcesSlice, selectTotal);

export const getSelectedSourceId = createSelector(
  getSourcesSlice,
  (state: SourcesState) => state.selectedId
);

export const getSourcesLoaded = createSelector(
  getSourcesSlice,
  (state: SourcesState) => state.loaded
);

export const getSourcesError = createSelector(
  getSourcesSlice,
  (state: SourcesState) => state.error
);

export const getSelectedSource = createSelector(
  getSourcesEntities,
  getSelectedSourceId,
  (entities, selectedId) => selectedId && entities[selectedId]
);

export const getCurrentSchema = createSelector(
  getSourcesSlice,
  (state: SourcesState) => state.currentSchema
);

// Derived selectors unique to Ingress domain
export const getHealthySources = createSelector(getAllSources, (sources) =>
  sources.filter((s) => s.status === 'connected')
);

export const getErrorSources = createSelector(getAllSources, (sources) =>
  sources.filter((s) => s.status === 'error')
);

export const getSyncingSources = createSelector(getAllSources, (sources) =>
  sources.filter((s) => s.status === 'syncing' || s.status === 'testing')
);

export const getSourcesByStatus = createSelector(getAllSources, (sources) => {
  const grouped: Record<string, number> = {};
  sources.forEach((s) => {
    grouped[s.status] = (grouped[s.status] || 0) + 1;
  });
  return grouped;
});
