import { createSelector } from '@ngrx/store';
import { getTransformationState } from './state';
import { PipelinesState, pipelinesAdapter } from './pipelines.reducer';

const { selectIds, selectEntities, selectAll, selectTotal } = pipelinesAdapter.getSelectors();

const getPipelinesSlice = createSelector(getTransformationState, (state) => state.pipelines);

export const getPipelineIds = createSelector(getPipelinesSlice, selectIds);
export const getPipelinesEntities = createSelector(getPipelinesSlice, selectEntities);
export const getAllPipelines = createSelector(getPipelinesSlice, selectAll);
export const getPipelinesTotal = createSelector(getPipelinesSlice, selectTotal);

export const getSelectedPipelineId = createSelector(
  getPipelinesSlice,
  (state: PipelinesState) => state.selectedId
);

export const getPipelinesLoaded = createSelector(
  getPipelinesSlice,
  (state: PipelinesState) => state.loaded
);

export const getPipelinesError = createSelector(
  getPipelinesSlice,
  (state: PipelinesState) => state.error
);

export const getSelectedPipeline = createSelector(
  getPipelinesEntities,
  getSelectedPipelineId,
  (entities, selectedId) => selectedId && entities[selectedId]
);

export const getPreview = createSelector(
  getPipelinesSlice,
  (state: PipelinesState) => state.preview
);

export const getRuns = createSelector(
  getPipelinesSlice,
  (state: PipelinesState) => state.runs
);

// Derived selectors unique to Transformation domain

// Get pipelines by status
export const getActivePipelines = createSelector(getAllPipelines, (pipelines) =>
  pipelines.filter((p) => p.status === 'active')
);

export const getDraftPipelines = createSelector(getAllPipelines, (pipelines) =>
  pipelines.filter((p) => p.status === 'draft')
);

export const getErrorPipelines = createSelector(getAllPipelines, (pipelines) =>
  pipelines.filter((p) => p.status === 'error')
);

// Get steps for the selected pipeline, sorted by order
export const getSelectedPipelineSteps = createSelector(
  getSelectedPipeline,
  (pipeline) => {
    if (!pipeline || !pipeline.steps) return [];
    return [...pipeline.steps].sort((a, b) => a.order - b.order);
  }
);

// Compose step output schemas through the pipeline
export const getPipelinePreview = createSelector(
  getSelectedPipeline,
  getSelectedPipelineSteps,
  (pipeline, steps) => {
    if (!pipeline || !steps.length) return null;
    const lastStep = steps[steps.length - 1];
    return lastStep?.outputSchema ?? null;
  }
);

// Get pipeline status counts
export const getPipelinesByStatus = createSelector(getAllPipelines, (pipelines) => {
  const grouped: Record<string, number> = {};
  pipelines.forEach((p) => {
    grouped[p.status] = (grouped[p.status] || 0) + 1;
  });
  return grouped;
});

// Get recent runs for the selected pipeline
export const getRecentRuns = createSelector(getRuns, (runs) =>
  [...runs].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )
);
