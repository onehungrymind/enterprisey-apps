import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { ExportJob, ExportFormat, JobStatus } from '@proto/api-interfaces';
import { ActionButtonComponent } from '@proto/ui-theme';

interface FormatConfig {
  icon: string;
  cssVar: string;
  label: string;
}

interface StatusConfig {
  color: string;
  label: string;
  icon: string;
}

const FORMAT_CONFIGS: Record<ExportFormat, FormatConfig> = {
  csv: { icon: '\u229e', cssVar: '--fmt-csv', label: 'CSV' },
  json: { icon: '{ }', cssVar: '--fmt-json', label: 'JSON' },
  xlsx: { icon: '\u229e', cssVar: '--fmt-xlsx', label: 'XLSX' },
  pdf: { icon: '\u25a4', cssVar: '--fmt-pdf', label: 'PDF' },
};

const STATUS_CONFIGS: Record<JobStatus, StatusConfig> = {
  completed: { color: 'var(--color-success)', label: 'Completed', icon: '\u2713' },
  processing: { color: 'var(--accent)', label: 'Processing', icon: '\u25ce' },
  queued: { color: 'var(--color-info)', label: 'Queued', icon: '\u25f7' },
  failed: { color: 'var(--color-danger)', label: 'Failed', icon: '\u2717' },
  cancelled: { color: 'var(--text-quaternary)', label: 'Cancelled', icon: '\u2298' },
};

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (job(); as j) {
      <div class="detail-container">
        <div class="header">
          <div
            class="format-icon"
            [style.color]="'var(' + formatConfig().cssVar + ')'"
          >
            {{ formatConfig().label }}
          </div>
          <div class="title-section">
            <h2 class="job-name">{{ j.name }}</h2>
            <div class="query-id">{{ j.queryId }}</div>
          </div>
        </div>

        @if (j.status === 'processing') {
          <div class="processing-banner">
            <div class="progress-value">{{ j.progress }}%</div>
            <div class="progress-info">~195K records - ~12s remaining</div>
          </div>
        }

        @if (j.error) {
          <div class="error-banner">
            <div class="error-title">Export Failed</div>
            <div class="error-message">{{ j.error }}</div>
          </div>
        }

        <div class="metrics-grid">
          @for (metric of metrics(); track metric.label) {
            <div class="metric-box">
              <div class="metric-label">{{ metric.label }}</div>
              <div class="metric-value" [style.color]="metric.color">
                {{ metric.value }}
              </div>
            </div>
          }
        </div>

        @if (j.scheduleCron) {
          <div class="schedule-section">
            <div class="section-label">Schedule</div>
            <div class="schedule-box">
              <div class="cron-value">{{ j.scheduleCron }}</div>
              <div class="next-run">Next: {{ nextRunTime() }}</div>
            </div>
          </div>
        }

        <div class="actions">
          @if (j.status === 'completed') {
            <ui-action-button variant="primary" (clicked)="download.emit()">
              Download
            </ui-action-button>
          }
          @if (j.status === 'failed') {
            <ui-action-button variant="danger" (clicked)="retry.emit()">
              Retry
            </ui-action-button>
          }
          <ui-action-button variant="secondary" (clicked)="configure.emit()">
            Configure
          </ui-action-button>
        </div>
      </div>
    } @else {
      <div class="empty-state">
        Select a job
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .detail-container {
      animation: fadeSlide 0.25s ease;
    }

    @keyframes fadeSlide {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--text-ghost);
      font-size: 12px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }

    .format-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--bg-surface-hover);
      border: 1px solid var(--border-default);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }

    .title-section {
      flex: 1;
    }

    .job-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .query-id {
      font-size: 10px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
      margin-top: 2px;
    }

    .processing-banner {
      background: var(--accent-subtle);
      border: 1px solid var(--border-default);
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 16px;
      text-align: center;
    }

    .progress-value {
      font-size: 22px;
      font-weight: 700;
      color: var(--accent);
      font-family: 'JetBrains Mono', monospace;
    }

    .progress-info {
      font-size: 11px;
      color: var(--text-tertiary);
    }

    .error-banner {
      background: var(--color-danger-subtle);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
    }

    .error-title {
      font-size: 10px;
      font-weight: 600;
      color: var(--color-danger);
      margin-bottom: 3px;
    }

    .error-message {
      font-size: 10px;
      color: var(--text-tertiary);
      font-family: 'JetBrains Mono', monospace;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }

    .metric-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      padding: 8px 10px;
    }

    .metric-label {
      font-size: 8px;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 3px;
    }

    .metric-value {
      font-size: 13px;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
    }

    .schedule-section {
      margin-bottom: 16px;
    }

    .section-label {
      font-size: 9px;
      font-weight: 600;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 6px;
    }

    .schedule-box {
      background: var(--bg-code);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      padding: 10px 12px;
    }

    .cron-value {
      font-size: 12px;
      color: var(--text-tertiary);
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 4px;
    }

    .next-run {
      font-size: 10px;
      color: var(--text-quaternary);
    }

    .actions {
      display: flex;
      gap: 6px;
    }

    .actions ui-action-button {
      flex: 1;
    }
  `]
})
export class JobDetailComponent {
  readonly job = input<ExportJob | null>(null);

  readonly download = output<void>();
  readonly retry = output<void>();
  readonly configure = output<void>();

  protected readonly formatConfig = computed(() => {
    const j = this.job();
    if (!j) return FORMAT_CONFIGS.csv;
    return FORMAT_CONFIGS[j.format] || FORMAT_CONFIGS.csv;
  });

  protected readonly statusConfig = computed(() => {
    const j = this.job();
    if (!j) return STATUS_CONFIGS.queued;
    return STATUS_CONFIGS[j.status] || STATUS_CONFIGS.queued;
  });

  protected readonly metrics = computed(() => {
    const j = this.job();
    if (!j) return [];

    const fmt = this.formatConfig();
    const st = this.statusConfig();

    return [
      { label: 'Format', value: fmt.label, color: `var(${fmt.cssVar})` },
      { label: 'Status', value: st.label, color: st.color },
      { label: 'File Size', value: j.fileSize ? this.formatFileSize(j.fileSize) : '\u2014', color: 'var(--text-secondary)' },
      { label: 'Records', value: j.recordCount ? j.recordCount.toLocaleString() : '\u2014', color: 'var(--text-secondary)' },
      { label: 'Duration', value: this.calculateDuration(j), color: 'var(--text-secondary)' },
      { label: 'Created By', value: j.createdBy, color: 'var(--text-secondary)' },
    ];
  });

  protected readonly nextRunTime = computed(() => {
    // In a real app, this would calculate the next run from the cron expression
    return 'Tomorrow 6:00 AM';
  });

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private calculateDuration(job: ExportJob): string {
    if (!job.startedAt || !job.completedAt) return '\u2014';
    const start = new Date(job.startedAt);
    const end = new Date(job.completedAt);
    const diff = (end.getTime() - start.getTime()) / 1000;
    return `${diff.toFixed(1)}s`;
  }
}
