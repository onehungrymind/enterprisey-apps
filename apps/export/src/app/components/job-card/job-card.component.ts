import { Component, ChangeDetectionStrategy, input, output, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ExportJob, ExportFormat, JobStatus } from '@proto/api-interfaces';
import { ProgressBarComponent } from '@proto/ui-theme';

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
  selector: 'app-job-card',
  standalone: true,
  imports: [DecimalPipe, ProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="job-card"
      [class.selected]="selected()"
      (click)="cardClicked.emit()"
      [attr.data-testid]="'job-card-' + job().id"
      [attr.data-job-name]="job().name"
      [attr.data-job-status]="job().status"
    >
      @if (selected()) {
        <div class="selection-indicator"></div>
      }

      <div class="header">
        <div class="info">
          <div class="name" data-testid="job-name">{{ job().name }}</div>
          <div class="query" data-testid="job-query">{{ job().queryId }}</div>
        </div>
        <div class="badges">
          <span
            class="format-badge"
            [style.color]="'var(' + formatConfig().cssVar + ')'"
            data-testid="job-format"
          >
            {{ formatConfig().label }}
          </span>
          <span
            class="status-badge"
            [style.color]="statusConfig().color"
            data-testid="job-status"
          >
            {{ statusConfig().icon }} {{ statusConfig().label }}
          </span>
        </div>
      </div>

      @if (showProgress()) {
        <div class="progress-section" data-testid="job-progress-section">
          <ui-progress-bar
            [progress]="animatedProgress()"
            [status]="job().status === 'processing' ? 'processing' : 'queued'"
            data-testid="job-progress-bar"
          />
          <div class="progress-info">
            <span class="progress-percent" data-testid="job-progress-percent">{{ animatedProgress() | number:'1.0-0' }}%</span>
            <span class="progress-estimate" data-testid="job-progress-estimate">{{ estimatedTime() }}</span>
          </div>
        </div>
      }

      <div class="footer">
        <span class="schedule-type" data-testid="job-schedule-type">
          {{ job().scheduleCron ? '\u27f3 Scheduled' : '\u2299 One-time' }}
        </span>
        <span class="timestamp" data-testid="job-timestamp">{{ displayTime() }}</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .job-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      padding: 14px 16px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .job-card:hover {
      border-color: var(--border-strong);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .job-card.selected {
      background: var(--accent-subtle);
      border-color: var(--accent);
      box-shadow: var(--shadow-md);
    }

    .selection-indicator {
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: var(--accent);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .info {
      flex: 1;
      min-width: 0;
    }

    .name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .query {
      font-size: 10px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .badges {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
      margin-left: 8px;
    }

    .format-badge,
    .status-badge {
      font-size: 9px;
      font-weight: 700;
      background: var(--bg-surface-hover);
      border: 1px solid var(--border-default);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .format-badge {
      font-family: 'JetBrains Mono', monospace;
    }

    .status-badge {
      font-weight: 600;
    }

    .progress-section {
      margin-bottom: 6px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-top: 3px;
    }

    .progress-percent,
    .progress-estimate {
      font-size: 9px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-quaternary);
    }
  `]
})
export class JobCardComponent implements OnInit, OnDestroy {
  readonly job = input.required<ExportJob>();
  readonly selected = input(false);
  readonly cardClicked = output<void>();

  private progressInterval?: ReturnType<typeof setInterval>;
  readonly animatedProgress = signal(0);

  protected readonly formatConfig = computed(() =>
    FORMAT_CONFIGS[this.job().format] || FORMAT_CONFIGS.csv
  );

  protected readonly statusConfig = computed(() =>
    STATUS_CONFIGS[this.job().status] || STATUS_CONFIGS.queued
  );

  protected readonly showProgress = computed(() =>
    this.job().status === 'processing' || this.job().status === 'queued'
  );

  protected readonly estimatedTime = computed(() => {
    const job = this.job();
    if (job.status === 'processing') {
      return '~12s remaining';
    } else if (job.status === 'queued') {
      return '~45s estimated';
    }
    return '';
  });

  protected readonly displayTime = computed(() => {
    const job = this.job();
    if (job.completedAt) {
      return this.formatRelativeTime(job.completedAt);
    }
    if (job.status === 'processing') {
      return 'In progress...';
    }
    return '\u2014';
  });

  ngOnInit() {
    this.animatedProgress.set(this.job().progress);
    if (this.job().status === 'processing') {
      this.startProgressAnimation();
    }
  }

  ngOnDestroy() {
    this.stopProgressAnimation();
  }

  private startProgressAnimation() {
    this.progressInterval = setInterval(() => {
      const current = this.animatedProgress();
      if (current < 95) {
        this.animatedProgress.set(current + Math.random() * 2);
      }
    }, 1000);
  }

  private stopProgressAnimation() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  private formatRelativeTime(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  }
}
