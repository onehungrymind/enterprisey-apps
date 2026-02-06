import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Pipeline, TransformStep, PipelineRun, StepType } from '@proto/api-interfaces';
import { PipelinesFacade } from '@proto/transformation-state';
import {
  ThemeService,
  ThemeToggleComponent,
  PageHeaderComponent,
  ActionButtonComponent,
  StatusDotComponent,
  StatusType,
} from '@proto/ui-theme';

import { PipelineSidebarComponent } from './pipeline-sidebar/pipeline-sidebar.component';
import { PipelineCanvasComponent, CanvasStep, CanvasEdge } from './pipeline-canvas/pipeline-canvas.component';
import { StepInspectorComponent } from './step-inspector/step-inspector.component';
import { RunHistoryPanelComponent } from './run-history-panel/run-history-panel.component';

// Mock data for demo purposes (matching the design)
const MOCK_PIPELINES: Pipeline[] = [
  { id: 'pl-001', name: 'Customer 360 Enrichment', description: 'Production PostgreSQL', sourceId: 'src-1', steps: [], status: 'active', lastRunAt: '2 min ago', createdBy: 'system' },
  { id: 'pl-002', name: 'Payment Reconciliation', description: 'Stripe Payments API', sourceId: 'src-2', steps: [], status: 'active', lastRunAt: '14 min ago', createdBy: 'system' },
  { id: 'pl-003', name: 'Lead Scoring Pipeline', description: 'Salesforce CRM Export', sourceId: 'src-3', steps: [], status: 'draft', lastRunAt: null, createdBy: 'system' },
  { id: 'pl-004', name: 'Event Stream Processor', description: 'GitHub Webhook Events', sourceId: 'src-4', steps: [], status: 'active', lastRunAt: '12 sec ago', createdBy: 'system' },
  { id: 'pl-005', name: 'Warehouse Sync', description: 'Snowflake Data Warehouse', sourceId: 'src-5', steps: [], status: 'error', lastRunAt: 'Failed 23 min ago', createdBy: 'system' },
  { id: 'pl-006', name: 'Marketing Attribution', description: 'HubSpot Marketing', sourceId: 'src-6', steps: [], status: 'paused', lastRunAt: '3 days ago', createdBy: 'system' },
];

const MOCK_PIPELINE_STATS: Record<string, { runsToday: number; successRate: number; recordsProcessed: number }> = {
  'pl-001': { runsToday: 48, successRate: 99.8, recordsProcessed: 284000 },
  'pl-002': { runsToday: 96, successRate: 100, recordsProcessed: 1240000 },
  'pl-003': { runsToday: 0, successRate: 0, recordsProcessed: 0 },
  'pl-004': { runsToday: 2847, successRate: 99.92, recordsProcessed: 3450000 },
  'pl-005': { runsToday: 12, successRate: 75.0, recordsProcessed: 890000 },
  'pl-006': { runsToday: 0, successRate: 97.2, recordsProcessed: 45200 },
};

const MOCK_CANVAS_STEPS: Record<string, CanvasStep[]> = {
  'pl-001': [
    { id: 's1', type: 'source', name: 'PostgreSQL Users', config: 'SELECT * FROM users WHERE active = true', records: 284000, x: 60, y: 160 },
    { id: 's2', type: 'filter', name: 'Active Last 90d', config: "last_login >= NOW() - INTERVAL '90 days'", records: 198400, x: 280, y: 100 },
    { id: 's3', type: 'map', name: 'Enrich Fields', config: "full_name = first_name + ' ' + last_name\ntier_label = CASE plan_tier ...", records: 198400, x: 500, y: 100 },
    { id: 's4', type: 'aggregate', name: 'Segment Counts', config: 'GROUP BY plan_tier\nCOUNT(*), AVG(lifetime_value)', records: 4, x: 500, y: 260 },
    { id: 's5', type: 'deduplicate', name: 'Dedup by Email', config: 'DISTINCT ON (email)\nORDER BY updated_at DESC', records: 195200, x: 720, y: 100 },
    { id: 's6', type: 'sort', name: 'By LTV Desc', config: 'ORDER BY lifetime_value DESC', records: 195200, x: 940, y: 100 },
    { id: 's7', type: 'output', name: 'Enriched Customers', config: '-> reporting.customer_360\n-> export.customer_segments', records: 195200, x: 1160, y: 160 },
  ],
  'pl-002': [
    { id: 's1', type: 'source', name: 'Stripe Events', config: 'payment_intent.* events', records: 1240000, x: 60, y: 160 },
    { id: 's2', type: 'filter', name: 'Succeeded Only', config: "status = 'succeeded'", records: 1178000, x: 280, y: 120 },
    { id: 's3', type: 'map', name: 'Normalize Currency', config: "amount_usd = convert(amount, currency, 'USD')", records: 1178000, x: 500, y: 120 },
    { id: 's4', type: 'aggregate', name: 'Daily Totals', config: 'GROUP BY DATE(created)\nSUM(amount_usd)', records: 365, x: 720, y: 120 },
    { id: 's5', type: 'output', name: 'Revenue Table', config: '-> reporting.daily_revenue', records: 365, x: 940, y: 160 },
  ],
  'pl-004': [
    { id: 's1', type: 'source', name: 'GitHub Events', config: 'All webhook event types', records: 3450000, x: 60, y: 160 },
    { id: 's2', type: 'filter', name: 'Push + PR Only', config: "event_type IN ('push','pull_request')", records: 2070000, x: 280, y: 80 },
    { id: 's3', type: 'filter', name: 'Main Branch', config: "ref = 'refs/heads/main'", records: 890000, x: 500, y: 80 },
    { id: 's4', type: 'map', name: 'Extract Metadata', config: 'author = payload.head_commit.author\nfiles_changed = ...', records: 890000, x: 720, y: 80 },
    { id: 's5', type: 'aggregate', name: 'Dev Activity', config: 'GROUP BY author, DATE(received_at)\nCOUNT(*)', records: 12400, x: 720, y: 240 },
    { id: 's6', type: 'deduplicate', name: 'Unique Commits', config: 'DISTINCT ON (payload.head_commit.id)', records: 845000, x: 940, y: 80 },
    { id: 's7', type: 'output', name: 'Commit Stream', config: '-> reporting.dev_dashboard\n-> export.commits', records: 845000, x: 1160, y: 160 },
  ],
};

const MOCK_EDGES: Record<string, CanvasEdge[]> = {
  'pl-001': [['s1', 's2'], ['s1', 's4'], ['s2', 's3'], ['s3', 's5'], ['s5', 's6'], ['s6', 's7'], ['s4', 's7']],
  'pl-002': [['s1', 's2'], ['s2', 's3'], ['s3', 's4'], ['s4', 's5']],
  'pl-004': [['s1', 's2'], ['s2', 's3'], ['s3', 's4'], ['s4', 's6'], ['s3', 's5'], ['s6', 's7'], ['s5', 's7']],
};

const MOCK_RUN_HISTORY: PipelineRun[] = [
  { id: 'r1', pipelineId: 'pl-001', status: 'completed', startedAt: '14:32:01', completedAt: '14:32:05', recordsProcessed: 198400, errors: [] },
  { id: 'r2', pipelineId: 'pl-004', status: 'completed', startedAt: '14:31:48', completedAt: '14:31:49', recordsProcessed: 12403, errors: [] },
  { id: 'r3', pipelineId: 'pl-002', status: 'completed', startedAt: '14:28:00', completedAt: '14:28:12', recordsProcessed: 4200, errors: [] },
  { id: 'r4', pipelineId: 'pl-005', status: 'failed', startedAt: '14:23:44', completedAt: '14:24:14', recordsProcessed: 0, errors: ['Connection timeout'] },
  { id: 'r5', pipelineId: 'pl-004', status: 'completed', startedAt: '14:21:12', completedAt: '14:21:13', recordsProcessed: 8921, errors: [] },
  { id: 'r6', pipelineId: 'pl-001', status: 'completed', startedAt: '14:02:01', completedAt: '14:02:05', recordsProcessed: 197800, errors: [] },
];

export interface PipelineWithStats extends Pipeline {
  runsToday: number;
  successRate: number;
  recordsProcessed: number;
}

@Component({
  selector: 'proto-pipelines',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ThemeToggleComponent,
    PageHeaderComponent,
    ActionButtonComponent,
    StatusDotComponent,
    PipelineSidebarComponent,
    PipelineCanvasComponent,
    StepInspectorComponent,
    RunHistoryPanelComponent,
  ],
  templateUrl: './pipelines.component.html',
  styleUrl: './pipelines.component.scss',
})
export class PipelinesComponent implements OnInit {
  private readonly pipelinesFacade = inject(PipelinesFacade);
  protected readonly themeService = inject(ThemeService);

  // State
  protected readonly selectedPipelineId = signal<string>('pl-001');
  protected readonly selectedStepId = signal<string | null>(null);
  protected readonly showRunHistory = signal(false);
  protected readonly searchQuery = signal('');

  // Data from facade (using mock data for demo, would use facade in production)
  private readonly facadePipelines = toSignal(this.pipelinesFacade.allPipelines$, { initialValue: [] });
  private readonly facadeRuns = toSignal(this.pipelinesFacade.recentRuns$, { initialValue: [] });

  // Use mock data for demo
  protected readonly pipelines = computed<PipelineWithStats[]>(() => {
    const query = this.searchQuery().toLowerCase();
    return MOCK_PIPELINES
      .filter(p => !query || p.name.toLowerCase().includes(query))
      .map(p => ({
        ...p,
        ...MOCK_PIPELINE_STATS[p.id || ''] || { runsToday: 0, successRate: 0, recordsProcessed: 0 },
      }));
  });

  protected readonly currentPipeline = computed(() => {
    const id = this.selectedPipelineId();
    return this.pipelines().find(p => p.id === id) || null;
  });

  protected readonly currentSteps = computed(() => {
    const id = this.selectedPipelineId();
    return MOCK_CANVAS_STEPS[id] || [];
  });

  protected readonly currentEdges = computed(() => {
    const id = this.selectedPipelineId();
    return MOCK_EDGES[id] || [];
  });

  protected readonly selectedStep = computed(() => {
    const stepId = this.selectedStepId();
    if (!stepId) return null;
    return this.currentSteps().find(s => s.id === stepId) || null;
  });

  protected readonly runHistory = computed(() => {
    // In production, filter by selected pipeline
    return MOCK_RUN_HISTORY;
  });

  ngOnInit(): void {
    this.pipelinesFacade.loadPipelines();
  }

  protected selectPipeline(pipeline: Pipeline): void {
    this.selectedPipelineId.set(pipeline.id || '');
    this.selectedStepId.set(null);
    this.showRunHistory.set(false);
  }

  protected selectStep(stepId: string): void {
    this.selectedStepId.set(stepId);
  }

  protected toggleRunHistory(): void {
    this.showRunHistory.update(v => !v);
  }

  protected onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  protected createNewPipeline(): void {
    // Would open a modal or navigate to creation form
    console.log('Create new pipeline');
  }

  protected getStatusType(status: string): StatusType {
    switch (status) {
      case 'active': return 'active';
      case 'draft': return 'draft';
      case 'paused': return 'paused';
      case 'error': return 'error';
      default: return 'unknown';
    }
  }
}
