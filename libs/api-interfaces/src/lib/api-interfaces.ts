// =============================================================================
// Base
// =============================================================================
export interface BaseEntity {
  id?: string | null;
}

// =============================================================================
// Health Monitoring
// =============================================================================
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ComponentHealth {
  name: string;
  status: HealthStatus;
  responseTimeMs: number;
  message?: string;
}

export interface ApiHealthResponse {
  status: HealthStatus;
  timestamp: string;
  api: ComponentHealth;
  database: ComponentHealth;
  uptime: number;
}

export interface FeatureHealth {
  featureSlug: string;
  featureName: string;
  webApp: { status: HealthStatus; responseTimeMs: number } | null;
  api: ApiHealthResponse | null;
  lastChecked: string;
}

// =============================================================================
// Ingress Domain
// =============================================================================
export type DataSourceType = 'database' | 'rest_api' | 'csv_file' | 'webhook';
export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'syncing' | 'testing';
export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';

export interface DataSource extends BaseEntity {
  name: string;
  type: DataSourceType;
  connectionConfig: Record<string, string>;
  status: ConnectionStatus;
  lastSyncAt: string | null;
  syncFrequency: string;
  errorLog: string[];
  createdBy: string;
}

export interface DataSchema extends BaseEntity {
  sourceId: string;
  fields: SchemaField[];
  discoveredAt: string;
  version: number;
}

export interface SchemaField {
  name: string;
  type: FieldType;
  nullable: boolean;
  sampleValues: string[];
}

// =============================================================================
// Transformation Domain
// =============================================================================
export type PipelineStatus = 'draft' | 'active' | 'paused' | 'error';
export type StepType = 'filter' | 'map' | 'aggregate' | 'join' | 'sort' | 'deduplicate';
export type RunStatus = 'running' | 'completed' | 'failed';

export interface Pipeline extends BaseEntity {
  name: string;
  description: string;
  sourceId: string;
  steps: TransformStep[];
  status: PipelineStatus;
  lastRunAt: string | null;
  createdBy: string;
}

export interface TransformStep extends BaseEntity {
  pipelineId: string;
  order: number;
  type: StepType;
  config: Record<string, any>;
  inputSchema: SchemaField[];
  outputSchema: SchemaField[];
}

export interface PipelineRun extends BaseEntity {
  pipelineId: string;
  status: RunStatus;
  startedAt: string;
  completedAt: string | null;
  recordsProcessed: number;
  errors: string[];
}

// =============================================================================
// Reporting Domain
// =============================================================================
export type WidgetType = 'table' | 'bar_chart' | 'line_chart' | 'pie_chart' | 'metric' | 'text';

export interface Dashboard extends BaseEntity {
  name: string;
  description: string;
  widgets: Widget[];
  filters: DashboardFilter[];
  createdBy: string;
  isPublic: boolean;
}

export interface Widget extends BaseEntity {
  dashboardId: string;
  type: WidgetType;
  title: string;
  queryId: string;
  config: Record<string, any>;
  position: { x: number; y: number; w: number; h: number };
}

export interface DashboardFilter extends BaseEntity {
  field: string;
  label: string;
  type: 'select' | 'date_range' | 'text';
  options?: string[];
  defaultValue?: string;
}

export interface ReportQuery extends BaseEntity {
  name: string;
  pipelineId: string;
  aggregation: AggregationConfig;
  filters: QueryFilter[];
  cachedAt: string | null;
  cacheDuration: number;
}

export interface AggregationConfig {
  groupBy: string[];
  metrics: AggregationMetric[];
}

export interface AggregationMetric {
  field: string;
  function: 'count' | 'sum' | 'avg' | 'min' | 'max';
  alias: string;
}

export interface QueryFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  totalRows: number;
  executedAt: string;
}

// =============================================================================
// Export Domain
// =============================================================================
export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface ExportJob extends BaseEntity {
  name: string;
  queryId: string;
  format: ExportFormat;
  status: JobStatus;
  progress: number;
  scheduleCron: string | null;
  outputUrl: string | null;
  createdBy: string;
  startedAt: string | null;
  completedAt: string | null;
  fileSize: number | null;
  recordCount: number | null;
  error: string | null;
}

// =============================================================================
// Feature (existing, kept)
// =============================================================================
export interface Feature extends BaseEntity {
  title: string;
  description: string;
  remote_uri: string;
  api_uri: string;
  slug: string;
  healthy: boolean;
}

export interface CompanyFeatures extends BaseEntity {
  company_id: string;
  remote_id: string;
}

// =============================================================================
// User & Auth (existing, kept)
// =============================================================================
export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoleEnum;
  company_id: string;
}

export enum UserRoleEnum {
  ADMIN = 'admin',
  MENTOR = 'mentor',
  APPRENTICE = 'apprentice',
  USER = 'user',
}

export interface Company extends BaseEntity {
  name: string;
  description: string;
}

export interface Login {
  email: string;
  password: string;
}
