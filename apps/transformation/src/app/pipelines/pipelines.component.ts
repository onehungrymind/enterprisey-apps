import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Pipeline, TransformStep } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';
import { PipelinesFacade } from '@proto/transformation-state';
import { filter, Observable } from 'rxjs';

import { PipelineListComponent } from './pipeline-list/pipeline-list.component';
import { PipelineEditorComponent } from './pipeline-editor/pipeline-editor.component';
import { StepListComponent } from './step-list/step-list.component';
import { StepEditorComponent } from './step-editor/step-editor.component';
import { PipelinePreviewComponent } from './pipeline-preview/pipeline-preview.component';
import { RunHistoryComponent } from './run-history/run-history.component';

@Component({
  selector: 'proto-pipelines',
  imports: [
    CommonModule,
    MaterialModule,
    PipelineListComponent,
    PipelineEditorComponent,
    StepListComponent,
    StepEditorComponent,
    PipelinePreviewComponent,
    RunHistoryComponent,
  ],
  templateUrl: './pipelines.component.html',
  styleUrls: ['./pipelines.component.scss'],
})
export class PipelinesComponent implements OnInit {
  pipelines$ = this.pipelinesFacade.allPipelines$;
  selectedPipeline$: Observable<Pipeline> = this.pipelinesFacade.selectedPipeline$.pipe(
    filter((pipeline): pipeline is Pipeline => !!pipeline && typeof pipeline !== 'string')
  );
  steps$ = this.pipelinesFacade.selectedPipelineSteps$;
  preview$ = this.pipelinesFacade.preview$;
  runs$ = this.pipelinesFacade.recentRuns$;
  pipelinesByStatus$ = this.pipelinesFacade.pipelinesByStatus$;

  editingStep: TransformStep | null = null;

  constructor(private pipelinesFacade: PipelinesFacade) {}

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.loadPipelines();
    this.pipelinesFacade.resetSelectedPipeline();
    this.editingStep = null;
  }

  selectPipeline(pipeline: Pipeline) {
    this.pipelinesFacade.selectPipeline(pipeline.id as string);
    this.pipelinesFacade.loadPreview(pipeline.id as string);
    this.pipelinesFacade.loadRuns(pipeline.id as string);
  }

  loadPipelines() {
    this.pipelinesFacade.loadPipelines();
  }

  savePipeline(pipeline: Pipeline) {
    this.pipelinesFacade.savePipeline(pipeline);
  }

  deletePipeline(pipeline: Pipeline) {
    this.pipelinesFacade.deletePipeline(pipeline);
  }

  runPipeline(pipelineId: string) {
    this.pipelinesFacade.runPipeline(pipelineId);
  }

  editStep(step: TransformStep) {
    this.editingStep = { ...step };
  }

  newStep(pipelineId: string) {
    this.editingStep = {
      pipelineId,
      order: 0,
      type: 'filter',
      config: {},
      inputSchema: [],
      outputSchema: [],
    } as TransformStep;
  }

  saveStep(step: TransformStep) {
    if (step.id) {
      this.pipelinesFacade.updateStep(step);
    } else {
      this.pipelinesFacade.createStep(step);
    }
    this.editingStep = null;
  }

  deleteStep(step: TransformStep) {
    this.pipelinesFacade.deleteStep(step);
  }

  reorderStep(event: { stepId: string; newOrder: number }) {
    this.pipelinesFacade.reorderStep(event.stepId, event.newOrder);
  }

  cancelStepEdit() {
    this.editingStep = null;
  }
}
