import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Pipeline, PipelineRun, SchemaField } from '@proto/api-interfaces';
import { PipelinesActions } from './pipelines.actions';

export interface PipelinesState extends EntityState<Pipeline> {
  selectedId?: string | undefined;
  error?: string | null;
  loaded: boolean;
  preview: SchemaField[] | null;
  runs: PipelineRun[];
}

export const pipelinesAdapter: EntityAdapter<Pipeline> = createEntityAdapter<Pipeline>();

export const initialPipelinesState: PipelinesState = pipelinesAdapter.getInitialState({
  loaded: false,
  preview: null,
  runs: [],
});

const onFailure = (state: PipelinesState, { error }: any) => ({ ...state, error });

export const reducer = createReducer(
  initialPipelinesState,
  on(PipelinesActions.loadPipelines, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(PipelinesActions.selectPipeline, (state, { selectedId }) => ({
    ...state,
    selectedId,
    preview: null,
    runs: [],
  })),
  on(PipelinesActions.resetSelectedPipeline, (state) => ({
    ...state,
    selectedId: undefined,
    preview: null,
    runs: [],
  })),
  on(PipelinesActions.resetPipelines, (state) => pipelinesAdapter.removeAll(state)),
  // CRUD
  on(PipelinesActions.loadPipelinesSuccess, (state, { pipelines }) =>
    pipelinesAdapter.setAll(pipelines, { ...state, loaded: true })
  ),
  on(PipelinesActions.loadPipelineSuccess, (state, { pipeline }) =>
    pipelinesAdapter.upsertOne(pipeline, { ...state, loaded: true })
  ),
  on(PipelinesActions.createPipelineSuccess, (state, { pipeline }) =>
    pipelinesAdapter.addOne(pipeline, state)
  ),
  on(PipelinesActions.updatePipelineSuccess, (state, { pipeline }) =>
    pipelinesAdapter.updateOne({ id: pipeline.id || '', changes: pipeline }, state)
  ),
  on(PipelinesActions.deletePipelineSuccess, (state, { pipeline }) =>
    pipelinesAdapter.removeOne(pipeline?.id ?? '', state)
  ),
  // Pipeline operations
  on(PipelinesActions.runPipelineSuccess, (state, { run }) => ({
    ...state,
    runs: [run, ...state.runs],
  })),
  on(PipelinesActions.loadPreviewSuccess, (state, { preview }) => ({
    ...state,
    preview,
  })),
  on(PipelinesActions.loadRunsSuccess, (state, { runs }) => ({
    ...state,
    runs,
  })),
  // Failures
  on(
    PipelinesActions.loadPipelinesFailure,
    PipelinesActions.loadPipelineFailure,
    PipelinesActions.createPipelineFailure,
    PipelinesActions.updatePipelineFailure,
    PipelinesActions.deletePipelineFailure,
    PipelinesActions.runPipelineFailure,
    PipelinesActions.loadPreviewFailure,
    PipelinesActions.loadRunsFailure,
    PipelinesActions.createStepFailure,
    PipelinesActions.updateStepFailure,
    PipelinesActions.deleteStepFailure,
    PipelinesActions.reorderStepFailure,
    onFailure
  ),
);
