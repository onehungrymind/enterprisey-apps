import { Component, ChangeDetectionStrategy, signal, computed, OnInit, OnDestroy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageHeaderComponent, ThemeToggleComponent, ActionButtonComponent, ConfirmDialogComponent, ThemeService } from '@proto/ui-theme';
import { SourcesFacade } from '@proto/ingress-state';
import { DataSource } from '@proto/api-interfaces';
import { SourceListComponent } from './source-list/source-list.component';
import { SourceDetailComponent } from './source-detail/source-detail.component';
import { ThroughputChartComponent, ThroughputDataPoint } from './throughput-chart/throughput-chart.component';
import { ActivityLogComponent, ActivityLogEntry } from './activity-log/activity-log.component';
import { SourceData } from './source-card/source-card.component';
import { SourceFormComponent } from './source-form/source-form.component';

@Component({
  selector: 'proto-sources',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    ThemeToggleComponent,
    ActionButtonComponent,
    ConfirmDialogComponent,
    SourceListComponent,
    SourceDetailComponent,
    ThroughputChartComponent,
    ActivityLogComponent,
    SourceFormComponent,
  ],
  template: `
    <div class="app-shell" data-testid="ingress-app">
      <!-- Top Bar -->
      <ui-page-header title="Ingress" subtitle="Data Sources">
        <div slot="actions" class="header-actions">
          <span class="current-time">{{ formattedTime() }}</span>
          <ui-action-button variant="primary" (clicked)="addNewSource()" data-testid="new-source-button">
            + New Source
          </ui-action-button>
          <ui-theme-toggle />
        </div>
      </ui-page-header>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Left Panel: Source List -->
        <div class="left-panel" data-testid="sources-list-panel">
          <proto-source-list
            [sources]="sources()"
            [selectedId]="selectedId()"
            (selected)="selectSource($event)"
            data-testid="sources-list"
          />
        </div>

        <!-- Center Panel: Source Detail -->
        <div class="center-panel" data-testid="source-detail-panel">
          <proto-source-detail
            [source]="selectedSource()"
            (syncNow)="handleSyncNow($event)"
            (configure)="handleConfigure($event)"
            (testConnection)="handleTestConnection($event)"
            (delete)="handleDelete($event)"
            data-testid="source-detail"
          />
        </div>

        <!-- Right Panel: Throughput & Activity -->
        <div class="right-panel">
          <div class="throughput-section" data-testid="throughput-section">
            <div class="section-header">
              <span class="section-title">Throughput</span>
              <span class="throughput-value" data-testid="throughput-value">{{ currentThroughput() }}</span>
            </div>
            <proto-throughput-chart [data]="throughputData()" data-testid="throughput-chart" />
          </div>
          <div class="activity-section" data-testid="activity-section">
            <proto-activity-log [entries]="activityLog()" data-testid="activity-log" />
          </div>
        </div>
      </div>
    </div>

    <!-- Source Form Modal -->
    @if (showSourceForm()) {
      <proto-source-form
        [source]="editingSource()"
        (save)="saveSource($event)"
        (cancel)="closeForm()"
        data-testid="source-form-modal"
      />
    }

    <!-- Delete Confirmation Dialog -->
    @if (showDeleteConfirm() && deletingSource(); as source) {
      <ui-confirm-dialog
        title="Delete Source"
        [message]="'Are you sure you want to delete this data source?'"
        [details]="source.name"
        confirmLabel="Delete Source"
        cancelLabel="Cancel"
        confirmVariant="danger"
        (confirm)="confirmDelete()"
        (cancel)="cancelDelete()"
        data-testid="delete-confirm-dialog"
      />
    }
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
  private readonly sourcesFacade = inject(SourcesFacade);

  protected readonly currentTime = signal(new Date());
  protected readonly selectedId = signal<string | null>(null);

  // Form modal state
  protected readonly showSourceForm = signal(false);
  protected readonly editingSource = signal<DataSource | null>(null);

  // Delete confirmation state
  protected readonly showDeleteConfirm = signal(false);
  protected readonly deletingSource = signal<DataSource | null>(null);

  private timeInterval?: ReturnType<typeof setInterval>;

  // Sources from API via facade
  private readonly apiSources = toSignal(this.sourcesFacade.allSources$, { initialValue: [] });
  private readonly selectedApiSource = toSignal(this.sourcesFacade.selectedSource$);
  private readonly currentSchema = toSignal(this.sourcesFacade.currentSchema$);

  // Map API DataSource to UI SourceData format
  protected readonly sources = computed<SourceData[]>(() => {
    return this.apiSources().map(source => this.mapToSourceData(source));
  });

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
    const source = this.sources().find(s => s.id === id);
    if (!source) return null;

    // Merge schema fields if available
    const schema = this.currentSchema();
    if (schema && schema.sourceId === id) {
      return {
        ...source,
        fields: schema.fields.map(f => ({
          name: f.name,
          type: f.type,
          nullable: f.nullable,
        })),
      };
    }
    return source;
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
    // Load sources from API
    this.sourcesFacade.loadSources();

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
    this.sourcesFacade.selectSource(source.id);
    // Load schema for selected source
    this.sourcesFacade.loadSchema(source.id);
  }

  protected addNewSource() {
    this.editingSource.set(null);
    this.showSourceForm.set(true);
  }

  protected handleSyncNow(id: string) {
    this.sourcesFacade.syncSource(id);
  }

  protected handleConfigure(id: string) {
    const source = this.apiSources().find(s => s.id === id);
    if (source) {
      this.editingSource.set(source);
      this.showSourceForm.set(true);
    }
  }

  protected handleTestConnection(id: string) {
    this.sourcesFacade.testConnection(id);
  }

  protected handleDelete(id: string) {
    const source = this.apiSources().find(s => s.id === id);
    if (source) {
      this.deletingSource.set(source);
      this.showDeleteConfirm.set(true);
    }
  }

  protected saveSource(source: DataSource) {
    this.sourcesFacade.saveSource(source);
    this.closeForm();
  }

  protected closeForm() {
    this.showSourceForm.set(false);
    this.editingSource.set(null);
  }

  protected confirmDelete() {
    const source = this.deletingSource();
    if (source) {
      this.sourcesFacade.deleteSource(source);
      this.selectedId.set(null);
    }
    this.cancelDelete();
  }

  protected cancelDelete() {
    this.showDeleteConfirm.set(false);
    this.deletingSource.set(null);
  }

  // Map API DataSource to UI SourceData format
  private mapToSourceData(source: DataSource): SourceData {
    const config = source.connectionConfig || {};
    const host = config['host'] || config['url'] || config['endpoint'] || 'Unknown';
    const lastSyncAt = source.lastSyncAt;

    return {
      id: source.id || '',
      name: source.name,
      type: source.type,
      host,
      status: source.status,
      lastSync: lastSyncAt ? this.formatRelativeTime(lastSyncAt) : 'Never',
      nextSync: this.calculateNextSync(source.syncFrequency, lastSyncAt),
      frequency: source.syncFrequency || 'Manual',
      recordsIngested: parseInt(config['recordsIngested'] || '0', 10),
      tablesDiscovered: parseInt(config['tablesDiscovered'] || '0', 10),
      schemaVersion: parseInt(config['schemaVersion'] || '1', 10),
      errorRate: parseFloat(config['errorRate'] || '0'),
      avgLatency: parseInt(config['avgLatency'] || '0', 10),
      uptime: parseFloat(config['uptime'] || '0'),
      fields: [], // Will be populated when schema is loaded
      lastError: source.errorLog?.length ? source.errorLog[source.errorLog.length - 1] : undefined,
    };
  }

  private formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return `${diffSec} sec ago`;
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    return `${diffDay} days ago`;
  }

  private calculateNextSync(frequency: string, lastSyncAt: string | null): string {
    if (!frequency || frequency === 'Manual') return '—';
    if (!lastSyncAt) return 'Pending';

    // Parse frequency (e.g., "Hourly", "Daily", "Every 15 min")
    const lastSync = new Date(lastSyncAt);
    let nextSync: Date;

    if (frequency.toLowerCase() === 'hourly') {
      nextSync = new Date(lastSync.getTime() + 60 * 60 * 1000);
    } else if (frequency.toLowerCase() === 'daily') {
      nextSync = new Date(lastSync.getTime() + 24 * 60 * 60 * 1000);
    } else if (frequency.toLowerCase().includes('min')) {
      const minutes = parseInt(frequency.match(/\d+/)?.[0] || '30', 10);
      nextSync = new Date(lastSync.getTime() + minutes * 60 * 1000);
    } else if (frequency.toLowerCase() === 'real-time') {
      return 'On event';
    } else {
      return '—';
    }

    const now = new Date();
    if (nextSync <= now) return 'Now';

    const diffMs = nextSync.getTime() - now.getTime();
    const diffMin = Math.floor(diffMs / (60 * 1000));
    if (diffMin < 60) return `${diffMin} min`;
    const diffHour = Math.floor(diffMin / 60);
    return `${diffHour} hours`;
  }
}
