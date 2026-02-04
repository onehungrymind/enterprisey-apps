import { Dashboard, Widget, ReportQuery, QueryResult } from '@proto/api-interfaces';
import { of } from 'rxjs';

export const mockDashboardsStore = {
  loadAll: () => {},
  select: () => {},
  entities: () => [],
  selectedDashboard: () => null,
  loading: () => false,
  error: () => null,
};

export const mockDashboardsService = {
  all: () => of([]),
  find: () => of({ ...mockDashboard }),
  create: () => of({ ...mockDashboard }),
  update: () => of({ ...mockDashboard }),
  delete: () => of({ ...mockDashboard }),
};

export const mockWidget: Widget = {
  id: 'widget-1',
  dashboardId: 'dash-1',
  type: 'bar_chart',
  title: 'Monthly Revenue',
  queryId: 'query-1',
  config: { colorScheme: 'default' },
  position: { x: 0, y: 0, w: 6, h: 4 },
};

export const mockDashboard: Dashboard = {
  id: 'dash-1',
  name: 'Mock Dashboard',
  description: 'A mock reporting dashboard',
  widgets: [mockWidget],
  filters: [
    {
      id: 'filter-1',
      field: 'date_range',
      label: 'Date Range',
      type: 'date_range',
      defaultValue: 'last_30_days',
    },
  ],
  createdBy: 'user-1',
  isPublic: true,
};

export const mockEmptyDashboard: Dashboard = {
  id: null,
  name: '',
  description: '',
  widgets: [],
  filters: [],
  createdBy: '',
  isPublic: false,
};

export const mockReportQuery: ReportQuery = {
  id: 'query-1',
  name: 'Monthly Revenue Query',
  pipelineId: 'pipe-1',
  aggregation: {
    groupBy: ['month'],
    metrics: [{ field: 'revenue', function: 'sum', alias: 'total_revenue' }],
  },
  filters: [],
  cachedAt: '2025-01-15T12:00:00Z',
  cacheDuration: 3600,
};

export const mockQueryResult: QueryResult = {
  columns: ['month', 'total_revenue'],
  rows: [
    { month: '2025-01', total_revenue: 50000 },
    { month: '2025-02', total_revenue: 62000 },
    { month: '2025-03', total_revenue: 48000 },
  ],
  totalRows: 3,
  executedAt: '2025-01-15T12:00:00Z',
};
