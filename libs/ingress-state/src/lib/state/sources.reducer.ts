import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { DataSource, DataSchema } from '@proto/api-interfaces';
import { SourcesActions } from './sources.actions';

export interface SourcesState extends EntityState<DataSource> {
  selectedId?: string | undefined;
  error?: string | null;
  loaded: boolean;
  currentSchema: DataSchema | null;
}

export const sourcesAdapter: EntityAdapter<DataSource> = createEntityAdapter<DataSource>();

export const initialSourcesState: SourcesState = sourcesAdapter.getInitialState({
  loaded: false,
  currentSchema: null,
});

const onFailure = (state: SourcesState, { error }: any) => ({ ...state, error });

export const reducer = createReducer(
  initialSourcesState,
  on(SourcesActions.loadSources, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(SourcesActions.loadSource, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  // Selection
  on(SourcesActions.selectSource, (state, { selectedId }) =>
    Object.assign({}, state, { selectedId })
  ),
  on(SourcesActions.resetSelectedSource, (state) =>
    Object.assign({}, state, { selectedId: null, currentSchema: null })
  ),
  on(SourcesActions.resetSources, (state) => sourcesAdapter.removeAll(state)),
  // CRUD
  on(SourcesActions.loadSourcesSuccess, (state, { sources }) =>
    sourcesAdapter.setAll(sources, { ...state, loaded: true })
  ),
  on(SourcesActions.loadSourceSuccess, (state, { source }) =>
    sourcesAdapter.upsertOne(source, { ...state, loaded: true })
  ),
  on(SourcesActions.createSourceSuccess, (state, { source }) =>
    sourcesAdapter.addOne(source, state)
  ),
  on(SourcesActions.updateSourceSuccess, (state, { source }) =>
    sourcesAdapter.updateOne({ id: source.id || '', changes: source }, state)
  ),
  on(SourcesActions.deleteSourceSuccess, (state, { source }) =>
    sourcesAdapter.removeOne(source?.id ?? '', state)
  ),
  // Connection testing & sync — update entity status in place
  on(SourcesActions.testConnectionSuccess, (state, { source }) =>
    sourcesAdapter.updateOne({ id: source.id || '', changes: source }, state)
  ),
  on(SourcesActions.syncSourceSuccess, (state, { source }) =>
    sourcesAdapter.updateOne({ id: source.id || '', changes: source }, state)
  ),
  on(SourcesActions.statusUpdate, (state, { source }) =>
    sourcesAdapter.updateOne({ id: source.id || '', changes: source }, state)
  ),
  // Schema
  on(SourcesActions.loadSchemaSuccess, (state, { schema }) => ({
    ...state,
    currentSchema: schema,
  })),
  // Failures
  on(
    SourcesActions.loadSourcesFailure,
    SourcesActions.loadSourceFailure,
    SourcesActions.createSourceFailure,
    SourcesActions.updateSourceFailure,
    SourcesActions.deleteSourceFailure,
    SourcesActions.testConnectionFailure,
    SourcesActions.syncSourceFailure,
    SourcesActions.loadSchemaFailure,
    onFailure
  ),
);
