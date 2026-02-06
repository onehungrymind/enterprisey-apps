import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
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

interface ScheduleItem {
  time: string;
  jobName: string;
  format: ExportFormat;
  formatLabel: string;
  formatCssVar: string;
  cron: string;
}

@Component({
  selector: 'app-schedule-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="schedule-view">
      <div class="section-title">Upcoming Scheduled Exports</div>
      <div class="timeline">
        <div class="timeline-line"></div>
        @for (item of scheduleItems(); track item.jobName + item.time; let i = $index) {
          <div class="timeline-item" [style.animation-delay]="i * 0.06 + 's'">
            <div
              class="timeline-dot"
              [style.border-color]="'var(' + item.formatCssVar + ')'"
            >
              <div
                class="timeline-dot-inner"
                [style.background]="'var(' + item.formatCssVar + ')'"
              ></div>
            </div>
            <div class="schedule-card">
              <div class="card-header">
                <span class="job-name">{{ item.jobName }}</span>
                <span
                  class="format-badge"
                  [style.color]="'var(' + item.formatCssVar + ')'"
                >
                  {{ item.formatLabel }}
                </span>
              </div>
              <div class="schedule-time">{{ item.time }}</div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .schedule-view {
      padding: 0;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 16px;
    }

    .timeline {
      position: relative;
      padding-left: 20px;
    }

    .timeline-line {
      position: absolute;
      left: 6px;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--border-default);
    }

    .timeline-item {
      margin-bottom: 20px;
      position: relative;
      padding-left: 24px;
      animation: fadeSlide 0.3s ease both;
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

    .timeline-dot {
      position: absolute;
      left: -1px;
      top: 4px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--bg-root);
      border: 2px solid;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .timeline-dot-inner {
      width: 5px;
      height: 5px;
      border-radius: 50%;
    }

    .schedule-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 10px;
      padding: 12px 14px;
      box-shadow: var(--shadow-sm);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .job-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .format-badge {
      font-size: 9px;
      font-weight: 700;
      background: var(--bg-surface-hover);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
    }

    .schedule-time {
      font-size: 10px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
      margin-top: 3px;
    }
  `]
})
export class ScheduleViewComponent {
  readonly jobs = input<ExportJob[]>([]);

  protected readonly scheduleItems = computed((): ScheduleItem[] => {
    const jobList = this.jobs();

    // Get scheduled jobs
    const scheduledJobs = jobList.filter(j => j.scheduleCron);

    // Mock schedule items based on cron patterns
    // In a real app, you'd calculate actual next run times
    const items: ScheduleItem[] = [];

    scheduledJobs.forEach(job => {
      const formatConfig = FORMAT_CONFIGS[job.format] || FORMAT_CONFIGS.csv;
      // Add a mock schedule entry
      items.push({
        time: this.getNextRunTime(job.scheduleCron!),
        jobName: job.name,
        format: job.format,
        formatLabel: formatConfig.label,
        formatCssVar: formatConfig.cssVar,
        cron: job.scheduleCron!,
      });
    });

    // Sort by time (for demo, just return as-is)
    return items.slice(0, 8);
  });

  private getNextRunTime(cron: string): string {
    // Simple mock based on cron pattern
    // In production, use a proper cron parser
    if (cron.includes('*/4')) return '6:00 PM';
    if (cron.includes('0 6')) return 'Tomorrow 6:00 AM';
    if (cron.includes('0 8')) return 'Next Monday 8:00 AM';
    if (cron.includes('0 9')) return 'Tomorrow 9:00 AM';
    if (cron.includes('0 0 1')) return 'Feb 1';
    return 'Soon';
  }
}
