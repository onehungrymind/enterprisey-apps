import { Injectable, inject } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { Workshop } from '@proto/api-interfaces';
import { WorkshopsActions } from './workshops.actions';
import * as WorkshopsSelectors from './workshops.selectors';

@Injectable({
  providedIn: 'root',
})
export class WorkshopsFacade {
  private readonly store = inject(Store);

  loaded$ = this.store.pipe(select(WorkshopsSelectors.getWorkshopsLoaded));
  allWorkshops$ = this.store.pipe(select(WorkshopsSelectors.getAllWorkshops));
  selectedWorkshop$ = this.store.pipe(select(WorkshopsSelectors.getSelectedWorkshop));

  resetSelectedWorkshop() {
    this.dispatch(WorkshopsActions.resetSelectedWorkshop());
  }

  selectWorkshop(selectedId: string) {
    this.dispatch(WorkshopsActions.selectWorkshop({ selectedId }));
  }

  loadWorkshops() {
    this.dispatch(WorkshopsActions.loadWorkshops());
  }

  loadWorkshop(workshopId: string) {
    this.dispatch(WorkshopsActions.loadWorkshop({ workshopId }));
  }

  saveWorkshop(workshop: Workshop) {
    if (workshop.id) {
      this.updateWorkshop(workshop);
    } else {
      this.createWorkshop(workshop);
    }
  }

  createWorkshop(workshop: Workshop) {
    this.dispatch(WorkshopsActions.createWorkshop({ workshop }));
  }

  updateWorkshop(workshop: Workshop) {
    this.dispatch(WorkshopsActions.updateWorkshop({ workshop }));
  }

  deleteWorkshop(workshop: Workshop) {
    this.dispatch(WorkshopsActions.deleteWorkshop({ workshop }));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
