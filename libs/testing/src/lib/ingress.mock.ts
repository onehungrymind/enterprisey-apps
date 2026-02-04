import { DataSource, DataSchema } from '@proto/api-interfaces';
import { of } from 'rxjs';

export const mockSourcesFacade = {
  loadSources: () => {},
  selectSource: () => {},
  deleteSource: () => {},
  updateSource: () => {},
  createSource: () => {},
  testConnection: () => {},
  syncSource: () => {},
};

export const mockSourcesService = {
  all: () => of([]),
  find: () => of({ ...mockDataSource }),
  create: () => of({ ...mockDataSource }),
  update: () => of({ ...mockDataSource }),
  delete: () => of({ ...mockDataSource }),
  testConnection: () => of({ ...mockDataSource, status: 'testing' as const }),
  sync: () => of({ ...mockDataSource, status: 'syncing' as const }),
  getSchema: () => of({ ...mockDataSchema }),
};

export const mockDataSource: DataSource = {
  id: 'src-1',
  name: 'Mock Database',
  type: 'database',
  connectionConfig: { host: 'localhost', port: '5432', database: 'mock_db' },
  status: 'connected',
  lastSyncAt: '2025-01-15T10:00:00Z',
  syncFrequency: 'manual',
  errorLog: [],
  createdBy: 'user-1',
};

export const mockEmptyDataSource: DataSource = {
  id: null,
  name: '',
  type: 'rest_api',
  connectionConfig: {},
  status: 'disconnected',
  lastSyncAt: null,
  syncFrequency: 'manual',
  errorLog: [],
  createdBy: '',
};

export const mockDataSchema: DataSchema = {
  id: 'schema-1',
  sourceId: 'src-1',
  fields: [
    { name: 'id', type: 'number', nullable: false, sampleValues: ['1', '2', '3'] },
    { name: 'name', type: 'string', nullable: false, sampleValues: ['Alice', 'Bob'] },
    { name: 'email', type: 'string', nullable: true, sampleValues: ['a@test.com'] },
    { name: 'created_at', type: 'date', nullable: false, sampleValues: ['2025-01-01'] },
  ],
  discoveredAt: '2025-01-15T10:00:00Z',
  version: 1,
};
