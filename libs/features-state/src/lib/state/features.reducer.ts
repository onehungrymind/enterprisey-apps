import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Feature } from '@proto/api-interfaces';
import { FeaturesActions } from './features.actions';

export interface FeaturesState extends EntityState<Feature> {
  selectedId?: string | undefined;
  error?: string | null;
  loaded: boolean;
}

export const featuresAdapter: EntityAdapter<Feature> =
  createEntityAdapter<Feature>();

export const initialFeaturesState: FeaturesState =
  featuresAdapter.getInitialState({
    loaded: false,
  });

const onFailure = (state: FeaturesState, { error }: any) => ({
  ...state,
  error,
});

export const reducer = createReducer(
  initialFeaturesState,
  // TBD
  on(FeaturesActions.loadFeatures, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(FeaturesActions.loadFeature, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  // RESET
  on(FeaturesActions.selectFeature, (state, { selectedId }) =>
    Object.assign({}, state, { selectedId })
  ),
  on(FeaturesActions.resetSelectedFeature, (state) =>
    Object.assign({}, state, { selectedId: null })
  ),
  on(FeaturesActions.resetFeatures, (state) =>
    featuresAdapter.removeAll(state)
  ),
  // CRUD
  on(FeaturesActions.loadFeaturesSuccess, (state, { features }) =>
    featuresAdapter.setAll(features, { ...state, loaded: true })
  ),
  on(FeaturesActions.loadFeatureSuccess, (state, { feature }) =>
    featuresAdapter.upsertOne(feature, { ...state, loaded: true })
  ),
  on(FeaturesActions.createFeatureSuccess, (state, { feature }) =>
    featuresAdapter.addOne(feature, state)
  ),
  on(FeaturesActions.updateFeatureSuccess, (state, { feature }) =>
    featuresAdapter.updateOne({ id: feature.id || '', changes: feature }, state)
  ),
  on(FeaturesActions.deleteFeatureSuccess, (state, { feature }) =>
    featuresAdapter.removeOne(feature?.id ?? '', state)
  ),
  // FAILURE
  on(
    FeaturesActions.loadFeaturesFailure,
    FeaturesActions.loadFeatureFailure,
    FeaturesActions.createFeatureFailure,
    FeaturesActions.createFeatureFailure,
    FeaturesActions.createFeatureFailure,
    onFailure
  )
);
