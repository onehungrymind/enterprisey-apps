import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { PipelineRun } from '@proto/api-interfaces';

// Extended run info for display
export interface RunHistoryItem extends PipelineRun {
  pipelineName?: string;
  duration?: string;
  startedBy?: string;
}

// Map from API to mock data format
const PIPELINE_NAMES: Record<string, string> = {
  'pl-001': 'Customer 360 Enrichment',
  'pl-002': 'Payment Reconciliation',
  'pl-003': 'Lead Scoring Pipeline',
  'pl-004': 'Event Stream Processor',
  'pl-005': 'Warehouse Sync',
  'pl-006': 'Marketing Attribution',
};

@Component({
  selector: 'proto-run-history-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="history-panel">
      <div class="panel-header">Recent Pipeline Runs</div>

      <div class="run-list">
        @for (run of enrichedRuns(); track run.id) {
          <div class="run-row">
            <div class="run-info">
              <div class="run-pipeline">{{ run.pipelineName }}</div>
              <div class="run-meta">
                <span class="mono">{{ run.startedAt }}</span>
                <span class="dot">&#183;</span>
                <span>{{ run.startedBy || 'Scheduler' }}</span>
              </div>
            </div>

            <div class="run-status" [class]="run.status">
              @if (run.status === 'completed') {
                <span class="status-icon">&#10003;</span> Done
              } @else if (run.status === 'failed') {
                <span class="status-icon">&#10007;</span> Failed
              } @else {
                <span class="status-icon">&#8635;</span> Running
              }
            </div>

            <div class="run-duration mono">{{ run.duration || '---' }}</div>

            <div class="run-records mono">
              {{ formatRecords(run.recordsProcessed) }}
            </div>

            <div class="run-error">
              @if (run.errors && run.errors.length > 0) {
                {{ run.errors[0] }}
              }
            </div>
          </div>
        } @empty {
          <div class="empty-runs">No runs recorded yet</div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      flex: 1;
      overflow: hidden;
    }

    .history-panel {
      height: 100%;
      overflow: auto;
      padding: 20px 24px;
      background: var(--bg-root);
    }

    .panel-header {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 12px;
    }

    .run-list {
      display: flex;
      flex-direction: column;
    }

    .run-row {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-subtle);
      display: grid;
      grid-template-columns: 1fr 80px 80px 80px 100px;
      align-items: center;
      gap: 12px;
      transition: background 0.15s;

      &:hover {
        background: var(--bg-surface-hover);
      }
    }

    .run-info {
      min-width: 0;
    }

    .run-pipeline {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .run-meta {
      font-size: 10px;
      color: var(--text-quaternary);
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .mono {
      font-family: 'JetBrains Mono', monospace;
    }

    .dot {
      color: var(--text-ghost);
    }

    .run-status {
      font-size: 10px;
      font-weight: 600;
      text-align: center;
      padding: 3px 8px;
      border-radius: 10px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;

      &.completed {
        color: var(--color-success);
        background: var(--color-success-subtle);
      }

      &.failed {
        color: var(--color-danger);
        background: var(--color-danger-subtle);
      }

      &.running {
        color: var(--color-warning);
        background: var(--color-warning-subtle);
      }
    }

    .status-icon {
      font-size: 10px;
    }

    .run-duration,
    .run-records {
      font-size: 11px;
      color: var(--text-tertiary);
      text-align: center;
    }

    .run-error {
      font-size: 10px;
      color: var(--text-quaternary);
      text-align: right;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .empty-runs {
      padding: 40px;
      text-align: center;
      color: var(--text-ghost);
      font-size: 12px;
    }
  `]
})
export class RunHistoryPanelComponent {
  readonly runs = input.required<PipelineRun[]>();

  protected readonly enrichedRuns = computed<RunHistoryItem[]>(() => {
    return this.runs().map(run => ({
      ...run,
      pipelineName: PIPELINE_NAMES[run.pipelineId] || run.pipelineId,
      duration: this.calculateDuration(run),
      startedBy: this.getStartedBy(run),
    }));
  });

  protected formatRecords(count: number): string {
    if (!count) return '0';
    return count.toLocaleString();
  }

  private calculateDuration(run: PipelineRun): string {
    // For demo, generate plausible durations
    if (run.status === 'failed') {
      return '30.0s';
    }
    const base = Math.random() * 10 + 0.5;
    return `${base.toFixed(1)}s`;
  }

  private getStartedBy(run: PipelineRun): string {
    // For demo, alternate between Scheduler and Webhook
    if (run.pipelineId === 'pl-004') {
      return 'Webhook';
    }
    return 'Scheduler';
  }
}
