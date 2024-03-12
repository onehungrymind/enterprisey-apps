import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Workshop } from '@proto/api-interfaces';

import { WorkshopsActions } from './workshops.actions';

export interface WorkshopsState extends EntityState<Workshop> {
  selectedId?: string | undefined;
  error?: string | null;
  loaded: boolean;
}

export const workshopsAdapter: EntityAdapter<Workshop> = createEntityAdapter<Workshop>();

export const initialWorkshopsState: WorkshopsState = workshopsAdapter.getInitialState({
  loaded: false,
});

const onFailure = (state: WorkshopsState, { error }: any) => ({ ...state, error });

export const reducer = createReducer(
  initialWorkshopsState,
  // TBD
  on(WorkshopsActions.loadWorkshops, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(WorkshopsActions.loadWorkshop, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  // RESET
  on(WorkshopsActions.selectWorkshop, (state, { selectedId }) =>
    Object.assign({}, state, { selectedId })
  ),
  on(WorkshopsActions.resetSelectedWorkshop, (state) =>
    Object.assign({}, state, { selectedId: null })
  ),
  on(WorkshopsActions.resetWorkshops, (state) => workshopsAdapter.removeAll(state)),
  // CRUD
  on(WorkshopsActions.loadWorkshopsSuccess, (state, { workshops }) =>
    workshopsAdapter.setAll(workshops, { ...state, loaded: true })
  ),
  on(WorkshopsActions.loadWorkshopSuccess, (state, { workshop }) =>
    workshopsAdapter.upsertOne(workshop, { ...state, loaded: true })
  ),
  on(WorkshopsActions.createWorkshopSuccess, (state, { workshop }) =>
    workshopsAdapter.addOne(workshop, state)
  ),
  on(WorkshopsActions.updateWorkshopSuccess, (state, { workshop }) =>
    workshopsAdapter.updateOne({ id: workshop.id || '', changes: workshop }, state)
  ),
  on(WorkshopsActions.deleteWorkshopSuccess, (state, { workshop }) =>
    workshopsAdapter.removeOne(workshop?.id ?? '', state)
  ),
  // FAILURE
  on(
    WorkshopsActions.loadWorkshopsFailure,
    WorkshopsActions.loadWorkshopFailure,
    WorkshopsActions.createWorkshopFailure,
    WorkshopsActions.createWorkshopFailure,
    WorkshopsActions.createWorkshopFailure,
    WorkshopsActions.updateWorkshopFailure,
    WorkshopsActions.deleteWorkshopFailure,
    onFailure
  )
);
