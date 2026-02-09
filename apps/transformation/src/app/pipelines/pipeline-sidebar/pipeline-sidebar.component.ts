import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pipeline, PipelineStatus } from '@proto/api-interfaces';

export interface PipelineWithStats extends Pipeline {
  runsToday: number;
  successRate: number;
  recordsProcessed: number;
}

interface StatusConfig {
  color: string;
  label: string;
}

const STATUS_MAP: Record<PipelineStatus, StatusConfig> = {
  active: { color: 'var(--accent)', label: 'Active' },
  draft: { color: 'var(--text-quaternary)', label: 'Draft' },
  paused: { color: 'var(--color-info)', label: 'Paused' },
  error: { color: 'var(--color-danger)', label: 'Error' },
};

@Component({
  selector: 'proto-pipeline-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <aside class="sidebar" data-testid="pipeline-sidebar">
      <!-- Search -->
      <div class="search-box">
        <input
          type="text"
          placeholder="Search pipelines..."
          class="search-input"
          [ngModel]="searchValue()"
          (ngModelChange)="onSearchChange($event)"
          data-testid="pipeline-search-input"
        />
      </div>

      <!-- Pipeline List -->
      <div class="pipeline-list" data-testid="pipeline-list">
        @for (pipeline of pipelines(); track pipeline.id) {
          @let status = getStatusConfig(pipeline.status);
          @let isActive = pipeline.id === selectedId();
          <button
            type="button"
            class="pipeline-item"
            [class.active]="isActive"
            (click)="pipelineSelected.emit(pipeline)"
            [attr.data-testid]="'pipeline-item-' + pipeline.id"
            [attr.data-pipeline-name]="pipeline.name"
            [attr.data-pipeline-status]="pipeline.status"
          >
            <div class="item-header">
              <span class="item-name" data-testid="pipeline-item-name">{{ pipeline.name }}</span>
              <span
                class="status-badge"
                [style.color]="status.color"
                data-testid="pipeline-item-status"
              >
                {{ status.label }}
              </span>
            </div>
            <div class="item-meta">
              <span class="source" data-testid="pipeline-item-source">{{ getSourceName(pipeline.description) }}</span>
              <span class="runs" data-testid="pipeline-item-runs">{{ getRunsLabel(pipeline) }}</span>
            </div>
          </button>
        } @empty {
          <div class="empty-list" data-testid="empty-pipeline-list">No pipelines found</div>
        }
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }

    .sidebar {
      width: 280px;
      border-right: 1px solid var(--border-default);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      height: 100%;
      background: var(--bg-root);
    }

    .search-box {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .search-input {
      width: 100%;
      padding: 7px 10px;
      border-radius: 6px;
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      color: var(--text-secondary);
      font-size: 11px;
      outline: none;
      font-family: 'DM Sans', sans-serif;
      transition: border-color 0.15s;

      &::placeholder {
        color: var(--text-quaternary);
      }

      &:focus {
        border-color: var(--accent);
      }
    }

    .pipeline-list {
      flex: 1;
      overflow: auto;
      padding: 6px 8px;
    }

    .pipeline-item {
      width: 100%;
      padding: 10px 12px;
      border-radius: 8px;
      margin-bottom: 2px;
      background: transparent;
      border: 1px solid transparent;
      border-left: 2px solid transparent;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s;
      font-family: 'DM Sans', sans-serif;

      &:hover {
        background: var(--bg-surface-hover);
      }

      &.active {
        background: var(--accent-subtle);
        border-color: var(--border-strong);
        border-left-color: var(--accent);
      }
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .item-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      margin-right: 8px;
    }

    .status-badge {
      font-size: 9px;
      font-weight: 600;
      background: var(--bg-surface-hover);
      padding: 2px 6px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }

    .item-meta {
      font-size: 10px;
      color: var(--text-quaternary);
      display: flex;
      justify-content: space-between;
    }

    .source {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .runs {
      flex-shrink: 0;
      margin-left: 8px;
    }

    .empty-list {
      padding: 20px;
      text-align: center;
      color: var(--text-ghost);
      font-size: 12px;
    }
  `]
})
export class PipelineSidebarComponent {
  readonly pipelines = input.required<PipelineWithStats[]>();
  readonly selectedId = input<string | null>(null);
  readonly pipelineSelected = output<PipelineWithStats>();
  readonly searchChanged = output<string>();

  protected searchValue = signal('');

  protected getStatusConfig(status: PipelineStatus): StatusConfig {
    return STATUS_MAP[status] || { color: 'var(--text-quaternary)', label: 'Unknown' };
  }

  protected getSourceName(description: string): string {
    // Extract first word from description as source name
    return description?.split(' ')[0] || '';
  }

  protected getRunsLabel(pipeline: PipelineWithStats): string {
    if (pipeline.runsToday === 0) {
      return 'No runs';
    }
    return `${pipeline.runsToday} runs today`;
  }

  protected onSearchChange(value: string): void {
    this.searchChanged.emit(value);
  }
}
