import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { ActionButtonComponent } from '@proto/ui-theme';
import { SourceData } from '../source-card/source-card.component';

const TYPE_CONFIG: Record<string, { icon: string; label: string }> = {
  database: { icon: '\u26C1', label: 'Database' },
  rest_api: { icon: '\u21C4', label: 'REST API' },
  csv_file: { icon: '\u25A4', label: 'CSV File' },
  webhook: { icon: '\u26A1', label: 'Webhook' },
};

@Component({
  selector: 'proto-source-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActionButtonComponent],
  template: `
    @if (source(); as src) {
      <div class="detail-panel">
        <!-- Header -->
        <div class="detail-header">
          <div class="source-identity">
            <div class="icon-container">{{ typeConfig().icon }}</div>
            <div class="source-info">
              <h2 class="source-name">{{ src.name }}</h2>
              <div class="source-host">{{ src.host }}</div>
            </div>
          </div>
          <div class="action-buttons">
            @if (src.status !== 'syncing') {
              <ui-action-button variant="primary" (clicked)="syncNow.emit(src.id)">
                ▶ Sync Now
              </ui-action-button>
            }
            <ui-action-button variant="secondary" (clicked)="configure.emit(src.id)">
              ⚙ Configure
            </ui-action-button>
            <ui-action-button variant="secondary" (clicked)="testConnection.emit(src.id)">
              ↻ Test
            </ui-action-button>
            <ui-action-button variant="danger" (clicked)="delete.emit(src.id)">
              <span class="btn-icon-delete">🗑</span> Delete
            </ui-action-button>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Uptime</div>
            <div class="metric-value" [style.color]="getUptimeColor(src.uptime)">
              {{ src.uptime }}%
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Error Rate</div>
            <div class="metric-value" [style.color]="getErrorRateColor(src.errorRate)">
              {{ src.errorRate }}%
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Schema v.</div>
            <div class="metric-value info">v{{ src.schemaVersion }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Frequency</div>
            <div class="metric-value">{{ src.frequency }}</div>
          </div>
        </div>

        <!-- Error Alert -->
        @if (src.lastError) {
          <div class="error-alert">
            <span class="error-icon">\u26A0</span>
            <div class="error-content">
              <div class="error-title">Latest Error</div>
              <div class="error-message">{{ src.lastError }}</div>
            </div>
          </div>
        }

        <!-- Schema Section -->
        <div class="schema-section">
          <div class="section-title">Discovered Schema</div>
          <div class="schema-table">
            <div class="schema-header">
              <span>Field</span>
              <span>Type</span>
              <span>Nullable</span>
            </div>
            @for (field of src.fields; track field.name; let isLast = $last) {
              <div class="schema-row" [class.last]="isLast">
                <span class="field-name">{{ field.name }}</span>
                <span class="field-type">{{ field.type }}</span>
                <span class="field-nullable" [class.nullable]="field.nullable">
                  {{ field.nullable ? 'yes' : 'no' }}
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="empty-state">
        Select a data source to view details
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .detail-panel {
      animation: fadeIn 0.3s ease;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--text-quaternary);
      font-size: 13px;
    }

    .detail-header {
      margin-bottom: 24px;
    }

    .source-identity {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }

    .icon-container {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: var(--accent-subtle);
      border: 1px solid var(--border-default);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .source-info {
      display: flex;
      flex-direction: column;
    }

    .source-name {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.2;
    }

    .source-host {
      font-size: 11px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
      margin-top: 3px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-icon-delete {
      filter: grayscale(100%) brightness(0);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 24px;
    }

    .metric-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      padding: 10px 12px;
    }

    .metric-label {
      font-size: 9px;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 4px;
    }

    .metric-value {
      font-size: 16px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-secondary);
    }

    .metric-value.info {
      color: var(--color-info);
    }

    .error-alert {
      background: var(--color-danger-subtle);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }

    .error-icon {
      color: var(--color-danger);
      font-size: 14px;
      line-height: 1;
    }

    .error-content {
      flex: 1;
    }

    .error-title {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-danger);
      margin-bottom: 2px;
    }

    .error-message {
      font-size: 11px;
      color: var(--text-tertiary);
      font-family: 'JetBrains Mono', monospace;
      line-height: 1.5;
    }

    .schema-section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 10px;
    }

    .schema-table {
      background: var(--bg-code);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      overflow: hidden;
    }

    .schema-header {
      display: grid;
      grid-template-columns: 1fr 100px 60px;
      padding: 8px 14px;
      font-size: 9px;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid var(--border-subtle);
    }

    .schema-row {
      display: grid;
      grid-template-columns: 1fr 100px 60px;
      padding: 7px 14px;
      font-size: 11px;
      border-bottom: 1px solid var(--border-subtle);
      font-family: 'JetBrains Mono', monospace;
    }

    .schema-row.last {
      border-bottom: none;
    }

    .field-name {
      color: var(--text-secondary);
    }

    .field-type {
      color: var(--color-info);
    }

    .field-nullable {
      color: var(--text-quaternary);
    }

    .field-nullable.nullable {
      color: var(--color-warning);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class SourceDetailComponent {
  readonly source = input<SourceData | null>(null);

  readonly syncNow = output<string>();
  readonly configure = output<string>();
  readonly testConnection = output<string>();
  readonly delete = output<string>();

  protected readonly typeConfig = computed(() => {
    const src = this.source();
    if (!src) return { icon: '', label: '' };
    return TYPE_CONFIG[src.type] || TYPE_CONFIG['database'];
  });

  protected getUptimeColor(uptime: number): string {
    if (uptime > 99) return 'var(--color-success)';
    if (uptime > 95) return 'var(--color-warning)';
    return 'var(--color-danger)';
  }

  protected getErrorRateColor(errorRate: number): string {
    if (errorRate < 1) return 'var(--color-success)';
    if (errorRate < 5) return 'var(--color-warning)';
    return 'var(--color-danger)';
  }
}
