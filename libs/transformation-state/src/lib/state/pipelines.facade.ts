import { Injectable, inject } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { Pipeline, TransformStep } from '@proto/api-interfaces';
import { PipelinesActions } from './pipelines.actions';
import * as PipelinesSelectors from './pipelines.selectors';

@Injectable({
  providedIn: 'root',
})
export class PipelinesFacade {
  private readonly store = inject(Store);

  loaded$ = this.store.pipe(select(PipelinesSelectors.getPipelinesLoaded));
  allPipelines$ = this.store.pipe(select(PipelinesSelectors.getAllPipelines));
  selectedPipeline$ = this.store.pipe(select(PipelinesSelectors.getSelectedPipeline));
  preview$ = this.store.pipe(select(PipelinesSelectors.getPreview));
  runs$ = this.store.pipe(select(PipelinesSelectors.getRuns));
  recentRuns$ = this.store.pipe(select(PipelinesSelectors.getRecentRuns));
  activePipelines$ = this.store.pipe(select(PipelinesSelectors.getActivePipelines));
  draftPipelines$ = this.store.pipe(select(PipelinesSelectors.getDraftPipelines));
  errorPipelines$ = this.store.pipe(select(PipelinesSelectors.getErrorPipelines));
  selectedPipelineSteps$ = this.store.pipe(select(PipelinesSelectors.getSelectedPipelineSteps));
  pipelinePreview$ = this.store.pipe(select(PipelinesSelectors.getPipelinePreview));
  pipelinesByStatus$ = this.store.pipe(select(PipelinesSelectors.getPipelinesByStatus));

  resetSelectedPipeline() {
    this.dispatch(PipelinesActions.resetSelectedPipeline());
  }

  selectPipeline(selectedId: string) {
    this.dispatch(PipelinesActions.selectPipeline({ selectedId }));
  }

  loadPipelines() {
    this.dispatch(PipelinesActions.loadPipelines());
  }

  loadPipeline(pipelineId: string) {
    this.dispatch(PipelinesActions.loadPipeline({ pipelineId }));
  }

  savePipeline(pipeline: Pipeline) {
    if (pipeline.id) {
      this.updatePipeline(pipeline);
    } else {
      this.createPipeline(pipeline);
    }
  }

  createPipeline(pipeline: Pipeline) {
    this.dispatch(PipelinesActions.createPipeline({ pipeline }));
  }

  updatePipeline(pipeline: Pipeline) {
    this.dispatch(PipelinesActions.updatePipeline({ pipeline }));
  }

  deletePipeline(pipeline: Pipeline) {
    this.dispatch(PipelinesActions.deletePipeline({ pipeline }));
  }

  runPipeline(pipelineId: string) {
    this.dispatch(PipelinesActions.runPipeline({ pipelineId }));
  }

  loadPreview(pipelineId: string) {
    this.dispatch(PipelinesActions.loadPreview({ pipelineId }));
  }

  loadRuns(pipelineId: string) {
    this.dispatch(PipelinesActions.loadRuns({ pipelineId }));
  }

  createStep(step: TransformStep) {
    this.dispatch(PipelinesActions.createStep({ step }));
  }

  updateStep(step: TransformStep) {
    this.dispatch(PipelinesActions.updateStep({ step }));
  }

  deleteStep(step: TransformStep) {
    this.dispatch(PipelinesActions.deleteStep({ step }));
  }

  reorderStep(stepId: string, newOrder: number) {
    this.dispatch(PipelinesActions.reorderStep({ stepId, newOrder }));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
