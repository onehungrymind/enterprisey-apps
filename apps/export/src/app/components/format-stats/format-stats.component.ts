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

@Component({
  selector: 'app-format-stats',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="format-stats">
      <div class="section-label">Today's Output</div>
      <div class="stats-grid">
        @for (stat of formatStats(); track stat.format) {
          <div class="stat-box">
            <div
              class="stat-value"
              [style.color]="'var(' + stat.cssVar + ')'"
            >
              {{ stat.count }}
            </div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .format-stats {
      padding: 16px 18px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .section-label {
      font-size: 9px;
      font-weight: 600;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 10px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .stat-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      padding: 8px 10px;
      text-align: center;
    }

    .stat-value {
      font-size: 16px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }

    .stat-label {
      font-size: 8px;
      color: var(--text-quaternary);
      text-transform: uppercase;
    }
  `]
})
export class FormatStatsComponent {
  readonly jobs = input<ExportJob[]>([]);

  protected readonly formatStats = computed(() => {
    const jobList = this.jobs();
    const formats: ExportFormat[] = ['csv', 'json', 'xlsx', 'pdf'];

    return formats.map(format => {
      const config = FORMAT_CONFIGS[format];
      const count = jobList.filter(j => j.format === format && j.status === 'completed').length;
      return {
        format,
        count,
        cssVar: config.cssVar,
        label: config.label,
      };
    });
  });
}
