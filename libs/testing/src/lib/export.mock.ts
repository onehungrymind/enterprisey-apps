import { ExportJob } from '@proto/api-interfaces';
import { of } from 'rxjs';

export const mockExportJobsStore = {
  loadAll: () => {},
  startExport: () => {},
  cancelJob: () => {},
  pollActiveJobs: () => {},
  entities: () => [],
  activeJobs: () => [],
  completedJobs: () => [],
  polling: () => false,
};

export const mockExportJobsService = {
  all: () => of([]),
  find: () => of({ ...mockExportJob }),
  create: () => of({ ...mockExportJob }),
  cancel: () => of({ ...mockExportJob, status: 'cancelled' as const }),
  getActive: () => of([]),
};

export const mockExportJob: ExportJob = {
  id: 'job-1',
  name: 'Monthly Report Export',
  queryId: 'query-1',
  format: 'csv',
  status: 'completed',
  progress: 100,
  scheduleCron: null,
  outputUrl: '/exports/monthly-report.csv',
  createdBy: 'user-1',
  startedAt: '2025-01-15T12:00:00Z',
  completedAt: '2025-01-15T12:01:30Z',
  fileSize: 245000,
  recordCount: 1500,
  error: null,
};

export const mockEmptyExportJob: ExportJob = {
  id: null,
  name: '',
  queryId: '',
  format: 'csv',
  status: 'queued',
  progress: 0,
  scheduleCron: null,
  outputUrl: null,
  createdBy: '',
  startedAt: null,
  completedAt: null,
  fileSize: null,
  recordCount: null,
  error: null,
};
