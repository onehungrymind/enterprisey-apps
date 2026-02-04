import { Injectable, inject } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { DataSource } from '@proto/api-interfaces';
import { SourcesActions } from './sources.actions';
import * as SourcesSelectors from './sources.selectors';

@Injectable({
  providedIn: 'root',
})
export class SourcesFacade {
  private readonly store = inject(Store);

  loaded$ = this.store.pipe(select(SourcesSelectors.getSourcesLoaded));
  allSources$ = this.store.pipe(select(SourcesSelectors.getAllSources));
  selectedSource$ = this.store.pipe(select(SourcesSelectors.getSelectedSource));
  currentSchema$ = this.store.pipe(select(SourcesSelectors.getCurrentSchema));
  healthySources$ = this.store.pipe(select(SourcesSelectors.getHealthySources));
  errorSources$ = this.store.pipe(select(SourcesSelectors.getErrorSources));
  syncingSources$ = this.store.pipe(select(SourcesSelectors.getSyncingSources));
  sourcesByStatus$ = this.store.pipe(select(SourcesSelectors.getSourcesByStatus));

  resetSelectedSource() {
    this.dispatch(SourcesActions.resetSelectedSource());
  }

  selectSource(selectedId: string) {
    this.dispatch(SourcesActions.selectSource({ selectedId }));
  }

  loadSources() {
    this.dispatch(SourcesActions.loadSources());
  }

  loadSource(sourceId: string) {
    this.dispatch(SourcesActions.loadSource({ sourceId }));
  }

  saveSource(source: DataSource) {
    if (source.id) {
      this.updateSource(source);
    } else {
      this.createSource(source);
    }
  }

  createSource(source: DataSource) {
    this.dispatch(SourcesActions.createSource({ source }));
  }

  updateSource(source: DataSource) {
    this.dispatch(SourcesActions.updateSource({ source }));
  }

  deleteSource(source: DataSource) {
    this.dispatch(SourcesActions.deleteSource({ source }));
  }

  testConnection(sourceId: string) {
    this.dispatch(SourcesActions.testConnection({ sourceId }));
  }

  syncSource(sourceId: string) {
    this.dispatch(SourcesActions.syncSource({ sourceId }));
  }

  loadSchema(sourceId: string) {
    this.dispatch(SourcesActions.loadSchema({ sourceId }));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
