import { Component, ChangeDetectionStrategy, signal, computed, OnInit, OnDestroy, inject } from '@angular/core';
import { PageHeaderComponent, ThemeToggleComponent, ActionButtonComponent, ThemeService } from '@proto/ui-theme';
import { SourceListComponent } from './source-list/source-list.component';
import { SourceDetailComponent } from './source-detail/source-detail.component';
import { ThroughputChartComponent, ThroughputDataPoint } from './throughput-chart/throughput-chart.component';
import { ActivityLogComponent, ActivityLogEntry } from './activity-log/activity-log.component';
import { SourceData } from './source-card/source-card.component';

@Component({
  selector: 'proto-sources',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    ThemeToggleComponent,
    ActionButtonComponent,
    SourceListComponent,
    SourceDetailComponent,
    ThroughputChartComponent,
    ActivityLogComponent,
  ],
  template: `
    <div class="app-shell">
      <!-- Top Bar -->
      <ui-page-header title="Ingress" subtitle="Data Sources">
        <div slot="actions" class="header-actions">
          <span class="current-time">{{ formattedTime() }}</span>
          <ui-action-button variant="primary" (clicked)="addNewSource()">
            + New Source
          </ui-action-button>
          <ui-theme-toggle />
        </div>
      </ui-page-header>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Left Panel: Source List -->
        <div class="left-panel">
          <proto-source-list
            [sources]="sources()"
            [selectedId]="selectedId()"
            (selected)="selectSource($event)"
          />
        </div>

        <!-- Center Panel: Source Detail -->
        <div class="center-panel">
          <proto-source-detail
            [source]="selectedSource()"
            (syncNow)="handleSyncNow($event)"
            (configure)="handleConfigure($event)"
            (testConnection)="handleTestConnection($event)"
          />
        </div>

        <!-- Right Panel: Throughput & Activity -->
        <div class="right-panel">
          <div class="throughput-section">
            <div class="section-header">
              <span class="section-title">Throughput</span>
              <span class="throughput-value">{{ currentThroughput() }}</span>
            </div>
            <proto-throughput-chart [data]="throughputData()" />
          </div>
          <div class="activity-section">
            <proto-activity-log [entries]="activityLog()" />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      background: var(--bg-root);
    }

    .app-shell {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .current-time {
      font-size: 11px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
    }

    .main-content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .left-panel {
      width: 380px;
      border-right: 1px solid var(--border-default);
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
    }

    .center-panel {
      flex: 1;
      overflow-y: auto;
      padding: 20px 28px;
    }

    .right-panel {
      width: 320px;
      border-left: 1px solid var(--border-default);
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
    }

    .throughput-section {
      padding: 16px 18px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .section-title {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .throughput-value {
      color: var(--accent);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
    }

    .activity-section {
      flex: 1;
      overflow: hidden;
    }
  `]
})
export class SourcesComponent implements OnInit, OnDestroy {
  protected readonly themeService = inject(ThemeService);

  protected readonly currentTime = signal(new Date());
  protected readonly selectedId = signal<string | null>('ds-001');

  private timeInterval?: ReturnType<typeof setInterval>;

  // Mock data from the design file
  protected readonly sources = signal<SourceData[]>([
    {
      id: 'ds-001',
      name: 'Production PostgreSQL',
      type: 'database',
      host: 'db-prod-us-east.rds.amazonaws.com',
      status: 'connected',
      lastSync: '2 min ago',
      nextSync: '58 min',
      frequency: 'Hourly',
      recordsIngested: 2_847_392,
      tablesDiscovered: 47,
      schemaVersion: 3,
      errorRate: 0.02,
      avgLatency: 124,
      uptime: 99.97,
      fields: [
        { name: 'user_id', type: 'UUID', nullable: false },
        { name: 'email', type: 'VARCHAR(255)', nullable: false },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false },
        { name: 'plan_tier', type: 'ENUM', nullable: true },
        { name: 'last_login', type: 'TIMESTAMP', nullable: true },
      ],
    },
    {
      id: 'ds-002',
      name: 'Stripe Payments API',
      type: 'rest_api',
      host: 'api.stripe.com/v1',
      status: 'syncing',
      lastSync: 'Running...',
      nextSync: '\u2014',
      frequency: 'Every 15 min',
      recordsIngested: 589_120,
      tablesDiscovered: 12,
      schemaVersion: 1,
      errorRate: 0.0,
      avgLatency: 340,
      uptime: 100.0,
      fields: [
        { name: 'payment_id', type: 'STRING', nullable: false },
        { name: 'amount', type: 'INTEGER', nullable: false },
        { name: 'currency', type: 'STRING', nullable: false },
        { name: 'status', type: 'ENUM', nullable: false },
        { name: 'customer_id', type: 'STRING', nullable: true },
      ],
    },
    {
      id: 'ds-003',
      name: 'Salesforce CRM Export',
      type: 'csv_file',
      host: 'sftp.corp.internal/salesforce/',
      status: 'connected',
      lastSync: '4 hours ago',
      nextSync: '20 hours',
      frequency: 'Daily',
      recordsIngested: 124_800,
      tablesDiscovered: 3,
      schemaVersion: 2,
      errorRate: 1.2,
      avgLatency: 890,
      uptime: 98.1,
      fields: [
        { name: 'account_id', type: 'STRING', nullable: false },
        { name: 'company_name', type: 'STRING', nullable: false },
        { name: 'deal_stage', type: 'STRING', nullable: true },
        { name: 'arr_value', type: 'DECIMAL', nullable: true },
        { name: 'close_date', type: 'DATE', nullable: true },
      ],
    },
    {
      id: 'ds-004',
      name: 'GitHub Webhook Events',
      type: 'webhook',
      host: 'hooks.enterprisey.dev/github',
      status: 'connected',
      lastSync: '12 sec ago',
      nextSync: 'On event',
      frequency: 'Real-time',
      recordsIngested: 1_203_847,
      tablesDiscovered: 8,
      schemaVersion: 5,
      errorRate: 0.08,
      avgLatency: 23,
      uptime: 99.99,
      fields: [
        { name: 'event_type', type: 'STRING', nullable: false },
        { name: 'repo_name', type: 'STRING', nullable: false },
        { name: 'actor', type: 'STRING', nullable: false },
        { name: 'payload', type: 'JSONB', nullable: false },
        { name: 'received_at', type: 'TIMESTAMP', nullable: false },
      ],
    },
    {
      id: 'ds-005',
      name: 'Snowflake Data Warehouse',
      type: 'database',
      host: 'acme.us-east-1.snowflakecomputing.com',
      status: 'error',
      lastSync: 'Failed 23 min ago',
      nextSync: 'Retry in 7 min',
      frequency: 'Every 30 min',
      recordsIngested: 5_420_100,
      tablesDiscovered: 92,
      schemaVersion: 4,
      errorRate: 14.3,
      avgLatency: 2100,
      uptime: 87.2,
      fields: [
        { name: 'event_id', type: 'BIGINT', nullable: false },
        { name: 'session_id', type: 'STRING', nullable: false },
        { name: 'event_name', type: 'STRING', nullable: false },
        { name: 'properties', type: 'VARIANT', nullable: true },
      ],
      lastError: 'Connection timeout after 30s \u2014 authentication token expired',
    },
    {
      id: 'ds-006',
      name: 'HubSpot Marketing',
      type: 'rest_api',
      host: 'api.hubapi.com/crm/v3',
      status: 'disconnected',
      lastSync: '3 days ago',
      nextSync: '\u2014',
      frequency: 'Paused',
      recordsIngested: 45_200,
      tablesDiscovered: 6,
      schemaVersion: 1,
      errorRate: 0.0,
      avgLatency: 0,
      uptime: 0,
      fields: [
        { name: 'contact_id', type: 'STRING', nullable: false },
        { name: 'email', type: 'STRING', nullable: false },
        { name: 'lifecycle_stage', type: 'STRING', nullable: true },
      ],
      lastError: 'Integration paused by admin (jsmith@acme.co) on Jan 28',
    },
  ]);

  protected readonly throughputData = signal<ThroughputDataPoint[]>([
    { time: '12:00', value: 4200 },
    { time: '12:15', value: 5100 },
    { time: '12:30', value: 3800 },
    { time: '12:45', value: 6200 },
    { time: '13:00', value: 7800 },
    { time: '13:15', value: 8100 },
    { time: '13:30', value: 6900 },
    { time: '13:45', value: 9200 },
    { time: '14:00', value: 11400 },
    { time: '14:15', value: 8700 },
    { time: '14:30', value: 10200 },
  ]);

  protected readonly activityLog = signal<ActivityLogEntry[]>([
    { time: '14:32:01', source: 'GitHub Webhook Events', event: 'Received 847 push events', status: 'success' },
    { time: '14:31:45', source: 'Stripe Payments API', event: 'Sync batch 12/18 \u2014 4,200 records', status: 'running' },
    { time: '14:28:12', source: 'Production PostgreSQL', event: 'Sync completed \u2014 12,403 new records', status: 'success' },
    { time: '14:23:44', source: 'Snowflake Data Warehouse', event: 'Connection timeout \u2014 retrying in 7 min', status: 'error' },
    { time: '14:15:00', source: 'Salesforce CRM Export', event: "Schema drift detected \u2014 new field 'lead_score'", status: 'warning' },
    { time: '14:02:33', source: 'Production PostgreSQL', event: 'Schema version 3 validated', status: 'success' },
    { time: '13:58:10', source: 'Stripe Payments API', event: 'Sync started \u2014 estimated 75,000 records', status: 'running' },
    { time: '13:45:22', source: 'GitHub Webhook Events', event: 'Received 1,203 workflow_run events', status: 'success' },
  ]);

  protected readonly selectedSource = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.sources().find(s => s.id === id) || null;
  });

  protected readonly formattedTime = computed(() => {
    return this.currentTime().toLocaleTimeString('en-US', { hour12: false });
  });

  protected readonly currentThroughput = computed(() => {
    const data = this.throughputData();
    const lastValue = data[data.length - 1]?.value || 0;
    return (lastValue / 1000).toFixed(1) + 'k rec/min';
  });

  ngOnInit() {
    this.timeInterval = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  protected selectSource(source: SourceData) {
    this.selectedId.set(source.id);
  }

  protected addNewSource() {
    console.log('Add new source');
  }

  protected handleSyncNow(id: string) {
    console.log('Sync now:', id);
  }

  protected handleConfigure(id: string) {
    console.log('Configure:', id);
  }

  protected handleTestConnection(id: string) {
    console.log('Test connection:', id);
  }
}
