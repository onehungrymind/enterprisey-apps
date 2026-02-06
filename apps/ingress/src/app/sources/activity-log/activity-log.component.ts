import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface ActivityLogEntry {
  time: string;
  source: string;
  event: string;
  status: 'success' | 'error' | 'warning' | 'running';
}

@Component({
  selector: 'proto-activity-log',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="activity-log">
      <div class="log-header">Activity Log</div>
      <div class="log-entries">
        @for (entry of entries(); track entry.time + entry.event; let i = $index) {
          <div
            class="log-entry"
            [style.animation-delay]="i * 0.04 + 's'"
          >
            <div class="entry-header">
              <span
                class="status-dot"
                [style.background]="getStatusColor(entry.status)"
              ></span>
              <span class="entry-time">{{ entry.time }}</span>
              <span class="entry-source">{{ getSourceAbbrev(entry.source) }}</span>
            </div>
            <div class="entry-event">{{ entry.event }}</div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .activity-log {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .log-header {
      padding: 14px 18px 8px;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      position: sticky;
      top: 0;
      background: var(--bg-root);
      z-index: 1;
      transition: background 0.4s;
    }

    .log-entries {
      flex: 1;
      overflow-y: auto;
    }

    .log-entry {
      padding: 9px 18px;
      border-bottom: 1px solid var(--border-subtle);
      animation: fadeIn 0.3s ease both;
      transition: background 0.15s;
    }

    .log-entry:hover {
      background: var(--bg-surface-hover);
    }

    .entry-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
    }

    .status-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .entry-time {
      font-size: 10px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
    }

    .entry-source {
      font-size: 10px;
      color: var(--text-tertiary);
      font-weight: 500;
      margin-left: auto;
    }

    .entry-event {
      font-size: 11px;
      color: var(--text-secondary);
      padding-left: 13px;
      line-height: 1.4;
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
export class ActivityLogComponent {
  readonly entries = input.required<ActivityLogEntry[]>();

  protected getStatusColor(status: string): string {
    switch (status) {
      case 'success':
        return 'var(--color-success)';
      case 'error':
        return 'var(--color-danger)';
      case 'warning':
        return 'var(--color-warning)';
      case 'running':
        return 'var(--color-info)';
      default:
        return 'var(--text-quaternary)';
    }
  }

  protected getSourceAbbrev(source: string): string {
    return source.split(' ')[0];
  }
}
