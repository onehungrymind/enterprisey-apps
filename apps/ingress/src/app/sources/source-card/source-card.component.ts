import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { StatusDotComponent, StatusType } from '@proto/ui-theme';

export interface SourceData {
  id: string;
  name: string;
  type: 'database' | 'rest_api' | 'csv_file' | 'webhook';
  host: string;
  status: 'connected' | 'syncing' | 'error' | 'disconnected' | 'testing';
  lastSync: string;
  nextSync: string;
  frequency: string;
  recordsIngested: number;
  tablesDiscovered: number;
  schemaVersion: number;
  errorRate: number;
  avgLatency: number;
  uptime: number;
  fields: { name: string; type: string; nullable: boolean }[];
  lastError?: string;
}

const TYPE_CONFIG: Record<string, { icon: string; label: string }> = {
  database: { icon: '\u26C1', label: 'Database' },
  rest_api: { icon: '\u21C4', label: 'REST API' },
  csv_file: { icon: '\u25A4', label: 'CSV File' },
  webhook: { icon: '\u26A1', label: 'Webhook' },
};

@Component({
  selector: 'proto-source-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusDotComponent],
  template: `
    <div
      class="source-card"
      [class.selected]="isSelected()"
      (click)="select.emit()"
    >
      @if (isSelected()) {
        <div class="selected-indicator"></div>
      }

      <div class="card-header">
        <div class="source-info">
          <div class="icon-container">{{ typeConfig().icon }}</div>
          <div class="source-meta">
            <div class="source-name">{{ source().name }}</div>
            <div class="source-host">
              {{ typeConfig().label }} · {{ truncatedHost() }}
            </div>
          </div>
        </div>
        <ui-status-dot [status]="statusType()" [showLabel]="true" />
      </div>

      <div class="metrics-grid">
        <div class="metric">
          <div class="metric-label">Records</div>
          <div class="metric-value">{{ formattedRecords() }}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Tables</div>
          <div class="metric-value">{{ source().tablesDiscovered }}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Latency</div>
          <div class="metric-value">{{ source().avgLatency }}ms</div>
        </div>
      </div>

      <div class="sync-info">
        <span>Last: {{ source().lastSync }}</span>
        <span>Next: {{ source().nextSync }}</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .source-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      padding: 16px 18px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .source-card:hover {
      border-color: var(--border-strong);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    .source-card.selected {
      background: var(--accent-subtle);
      border-color: var(--accent);
      box-shadow: var(--shadow-md);
    }

    .selected-indicator {
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: linear-gradient(to bottom, var(--accent), var(--accent-strong));
      border-radius: 3px 0 0 3px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .source-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .icon-container {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background: var(--bg-surface-hover);
      border: 1px solid var(--border-default);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .source-meta {
      display: flex;
      flex-direction: column;
    }

    .source-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .source-host {
      font-size: 10px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
      margin-top: 2px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
    }

    .metric {
      display: flex;
      flex-direction: column;
    }

    .metric-label {
      font-size: 9px;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 2px;
    }

    .metric-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      font-family: 'JetBrains Mono', monospace;
    }

    .sync-info {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-quaternary);
    }
  `]
})
export class SourceCardComponent {
  readonly source = input.required<SourceData>();
  readonly isSelected = input(false);
  readonly select = output<void>();

  protected readonly typeConfig = computed(() => TYPE_CONFIG[this.source().type] || TYPE_CONFIG['database']);

  protected readonly statusType = computed((): StatusType => {
    const status = this.source().status;
    if (status === 'testing') return 'processing';
    return status as StatusType;
  });

  protected readonly truncatedHost = computed(() => {
    const host = this.source().host;
    return host.length > 32 ? host.slice(0, 32) + '...' : host;
  });

  protected readonly formattedRecords = computed(() => {
    const records = this.source().recordsIngested;
    if (records >= 1_000_000) {
      return (records / 1_000_000).toFixed(1) + 'M';
    }
    if (records >= 1_000) {
      return Math.round(records / 1_000) + 'K';
    }
    return records.toString();
  });
}
