import { Pipeline, TransformStep, PipelineRun } from '@proto/api-interfaces';
import { of } from 'rxjs';

export const mockPipelinesFacade = {
  loadPipelines: () => {},
  selectPipeline: () => {},
  deletePipeline: () => {},
  updatePipeline: () => {},
  createPipeline: () => {},
  runPipeline: () => {},
};

export const mockPipelinesService = {
  all: () => of([]),
  find: () => of({ ...mockPipeline }),
  create: () => of({ ...mockPipeline }),
  update: () => of({ ...mockPipeline }),
  delete: () => of({ ...mockPipeline }),
  run: () => of({ ...mockPipelineRun }),
  preview: () => of([]),
  getRuns: () => of([]),
};

export const mockTransformStep: TransformStep = {
  id: 'step-1',
  pipelineId: 'pipe-1',
  order: 0,
  type: 'filter',
  config: { field: 'status', operator: 'eq', value: 'active' },
  inputSchema: [
    { name: 'id', type: 'number', nullable: false, sampleValues: ['1'] },
    { name: 'status', type: 'string', nullable: false, sampleValues: ['active'] },
  ],
  outputSchema: [
    { name: 'id', type: 'number', nullable: false, sampleValues: ['1'] },
    { name: 'status', type: 'string', nullable: false, sampleValues: ['active'] },
  ],
};

export const mockPipeline: Pipeline = {
  id: 'pipe-1',
  name: 'Mock Pipeline',
  description: 'A mock transformation pipeline',
  sourceId: 'src-1',
  steps: [mockTransformStep],
  status: 'active',
  lastRunAt: '2025-01-15T12:00:00Z',
  createdBy: 'user-1',
};

export const mockEmptyPipeline: Pipeline = {
  id: null,
  name: '',
  description: '',
  sourceId: '',
  steps: [],
  status: 'draft',
  lastRunAt: null,
  createdBy: '',
};

export const mockPipelineRun: PipelineRun = {
  id: 'run-1',
  pipelineId: 'pipe-1',
  status: 'completed',
  startedAt: '2025-01-15T12:00:00Z',
  completedAt: '2025-01-15T12:01:00Z',
  recordsProcessed: 1500,
  errors: [],
};
