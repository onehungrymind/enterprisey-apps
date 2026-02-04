import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Pipeline, PipelineRun, SchemaField, TransformStep } from '@proto/api-interfaces';
import { PipelinesService, StepsService } from '@proto/transformation-data';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { PipelinesActions } from './pipelines.actions';

export const loadPipelines = createEffect(
  (actions$ = inject(Actions), pipelinesService = inject(PipelinesService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.loadPipelines),
      exhaustMap(() =>
        pipelinesService.all().pipe(
          map((pipelines: Pipeline[]) => PipelinesActions.loadPipelinesSuccess({ pipelines })),
          catchError((error) => of(PipelinesActions.loadPipelinesFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loadPipeline = createEffect(
  (actions$ = inject(Actions), pipelinesService = inject(PipelinesService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.loadPipeline),
      exhaustMap((action) =>
        pipelinesService.find(action.pipelineId).pipe(
          map((pipeline: Pipeline) => PipelinesActions.loadPipelineSuccess({ pipeline })),
          catchError((error) => of(PipelinesActions.loadPipelineFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const createPipeline = createEffect(
  (actions$ = inject(Actions), pipelinesService = inject(PipelinesService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.createPipeline),
      exhaustMap((action) =>
        pipelinesService.create(action.pipeline).pipe(
          map((pipeline: Pipeline) => PipelinesActions.createPipelineSuccess({ pipeline })),
          catchError((error) => of(PipelinesActions.createPipelineFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const updatePipeline = createEffect(
  (actions$ = inject(Actions), pipelinesService = inject(PipelinesService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.updatePipeline),
      exhaustMap((action) =>
        pipelinesService.update(action.pipeline).pipe(
          map((pipeline: Pipeline) => PipelinesActions.updatePipelineSuccess({ pipeline })),
          catchError((error) => of(PipelinesActions.updatePipelineFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const deletePipeline = createEffect(
  (actions$ = inject(Actions), pipelinesService = inject(PipelinesService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.deletePipeline),
      exhaustMap((action) =>
        pipelinesService.delete(action.pipeline).pipe(
          map(() => PipelinesActions.deletePipelineSuccess({ pipeline: action.pipeline })),
          catchError((error) => of(PipelinesActions.deletePipelineFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const runPipeline = createEffect(
  (actions$ = inject(Actions), pipelinesService = inject(PipelinesService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.runPipeline),
      exhaustMap((action) =>
        pipelinesService.run(action.pipelineId).pipe(
          map((run: PipelineRun) => PipelinesActions.runPipelineSuccess({ run })),
          catchError((error) => of(PipelinesActions.runPipelineFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loadPreview = createEffect(
  (actions$ = inject(Actions), pipelinesService = inject(PipelinesService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.loadPreview),
      switchMap((action) =>
        pipelinesService.preview(action.pipelineId).pipe(
          map((preview: SchemaField[]) => PipelinesActions.loadPreviewSuccess({ preview })),
          catchError((error) => of(PipelinesActions.loadPreviewFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loadRuns = createEffect(
  (actions$ = inject(Actions), pipelinesService = inject(PipelinesService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.loadRuns),
      exhaustMap((action) =>
        pipelinesService.getRuns(action.pipelineId).pipe(
          map((runs: PipelineRun[]) => PipelinesActions.loadRunsSuccess({ runs })),
          catchError((error) => of(PipelinesActions.loadRunsFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

// Step effects
export const createStep = createEffect(
  (actions$ = inject(Actions), stepsService = inject(StepsService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.createStep),
      exhaustMap((action) =>
        stepsService.create(action.step).pipe(
          map((step: TransformStep) => PipelinesActions.createStepSuccess({ step })),
          catchError((error) => of(PipelinesActions.createStepFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const updateStep = createEffect(
  (actions$ = inject(Actions), stepsService = inject(StepsService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.updateStep),
      exhaustMap((action) =>
        stepsService.update(action.step).pipe(
          map((step: TransformStep) => PipelinesActions.updateStepSuccess({ step })),
          catchError((error) => of(PipelinesActions.updateStepFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const deleteStep = createEffect(
  (actions$ = inject(Actions), stepsService = inject(StepsService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.deleteStep),
      exhaustMap((action) =>
        stepsService.delete(action.step).pipe(
          map(() => PipelinesActions.deleteStepSuccess({ step: action.step })),
          catchError((error) => of(PipelinesActions.deleteStepFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const reorderStep = createEffect(
  (actions$ = inject(Actions), stepsService = inject(StepsService)) => {
    return actions$.pipe(
      ofType(PipelinesActions.reorderStep),
      exhaustMap((action) =>
        stepsService.reorder(action.stepId, action.newOrder).pipe(
          map((step: TransformStep) => PipelinesActions.reorderStepSuccess({ step })),
          catchError((error) => of(PipelinesActions.reorderStepFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

// Reload pipeline after step mutations to get updated steps
export const reloadAfterStepChange = createEffect(
  (actions$ = inject(Actions), pipelinesService = inject(PipelinesService)) => {
    return actions$.pipe(
      ofType(
        PipelinesActions.createStepSuccess,
        PipelinesActions.updateStepSuccess,
        PipelinesActions.deleteStepSuccess,
        PipelinesActions.reorderStepSuccess
      ),
      switchMap((action) => {
        const pipelineId = action.step.pipelineId;
        return pipelinesService.find(pipelineId).pipe(
          map((pipeline: Pipeline) => PipelinesActions.loadPipelineSuccess({ pipeline })),
          catchError((error) => of(PipelinesActions.loadPipelineFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);
