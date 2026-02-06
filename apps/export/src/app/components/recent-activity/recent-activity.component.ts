import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ExportJob, ExportFormat } from '@proto/api-interfaces';

interface FormatConfig {
  cssVar: string;
  label: string;
}

const FORMAT_CONFIGS: Record<ExportFormat, FormatConfig> = {
  csv: { cssVar: '--fmt-csv', label: 'CSV' },
  json: { cssVar: '--fmt-json', label: 'JSON' },
  xlsx: { cssVar: '--fmt-xlsx', label: 'XLSX' },
  pdf: { cssVar: '--fmt-pdf', label: 'PDF' },
};

interface ActivityItem {
  time: string;
  jobName: string;
  format: ExportFormat;
  formatLabel: string;
  formatCssVar: string;
  records: number | null;
  size: string;
  success: boolean;
}

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="recent-activity">
      <div class="section-header">Recent</div>
      <div class="activity-list">
        @for (item of recentItems(); track item.time + item.jobName; let i = $index) {
          <div class="activity-row" [style.animation-delay]="i * 0.05 + 's'">
            <div class="row-header">
              <span
                class="status-dot"
                [style.background]="item.success ? 'var(--color-success)' : 'var(--color-danger)'"
              ></span>
              <span class="time">{{ item.time }}</span>
              <span
                class="format-tag"
                [style.color]="'var(' + item.formatCssVar + ')'"
              >
                {{ item.formatLabel }}
              </span>
            </div>
            <div class="job-name">{{ item.jobName }}</div>
            @if (item.records && item.records > 0) {
              <div class="details">
                {{ item.records | number }} records - {{ item.size }}
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .recent-activity {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }

    .section-header {
      padding: 12px 18px 6px;
      font-size: 9px;
      font-weight: 600;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      position: sticky;
      top: 0;
      background: var(--bg-root);
      transition: background 0.4s;
    }

    .activity-list {
      flex: 1;
      overflow: auto;
    }

    .activity-row {
      padding: 10px 18px;
      border-bottom: 1px solid var(--border-subtle);
      transition: background 0.15s;
      animation: fadeSlide 0.3s ease both;
    }

    .activity-row:hover {
      background: var(--bg-surface-hover);
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

    .row-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 3px;
    }

    .status-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
    }

    .time {
      font-size: 10px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
    }

    .format-tag {
      font-size: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      margin-left: auto;
    }

    .job-name {
      font-size: 11px;
      color: var(--text-secondary);
      padding-left: 11px;
    }

    .details {
      font-size: 9px;
      color: var(--text-ghost);
      padding-left: 11px;
      margin-top: 2px;
      font-family: 'JetBrains Mono', monospace;
    }
  `]
})
export class RecentActivityComponent {
  readonly jobs = input<ExportJob[]>([]);

  protected readonly recentItems = computed((): ActivityItem[] => {
    const jobList = this.jobs();

    // Get completed or failed jobs, sorted by completedAt descending
    const recentJobs = jobList
      .filter(j => j.status === 'completed' || j.status === 'failed')
      .sort((a, b) => {
        const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 10);

    return recentJobs.map(job => {
      const formatConfig = FORMAT_CONFIGS[job.format] || FORMAT_CONFIGS.csv;
      return {
        time: this.formatTime(job.completedAt),
        jobName: job.name,
        format: job.format,
        formatLabel: formatConfig.label,
        formatCssVar: formatConfig.cssVar,
        records: job.recordCount,
        size: job.fileSize ? this.formatFileSize(job.fileSize) : '\u2014',
        success: job.status === 'completed',
      };
    });
  });

  private formatTime(isoDate: string | null): string {
    if (!isoDate) return '\u2014';
    const date = new Date(isoDate);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
