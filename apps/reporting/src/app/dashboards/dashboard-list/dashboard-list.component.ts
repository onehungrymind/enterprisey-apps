import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export interface DashboardItem {
  id: string;
  name: string;
  widgets: number;
  updatedAt: string;
}

@Component({
  selector: 'proto-dashboard-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sidebar">
      <div class="section-label">Dashboards</div>

      @for (dashboard of dashboards(); track dashboard.id) {
        <div
          class="dash-tab"
          [class.active]="dashboard.id === activeDashboardId()"
          (click)="selected.emit(dashboard.id)"
        >
          <div class="dash-name">{{ dashboard.name }}</div>
          <div class="dash-meta">{{ dashboard.widgets }} widgets &middot; {{ dashboard.updatedAt }}</div>
        </div>
      }

      @if (loading()) {
        <div class="loading">Loading dashboards...</div>
      }

      @if (!loading() && dashboards().length === 0) {
        <div class="empty">No dashboards found</div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .sidebar {
      padding: 12px 8px;
    }

    .section-label {
      font-size: 9px;
      font-weight: 600;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 4px 10px;
      margin-bottom: 6px;
    }

    .dash-tab {
      padding: 10px 12px;
      border-radius: 8px;
      margin-bottom: 2px;
      cursor: pointer;
      transition: all 0.15s;
      background: transparent;
      border-left: 2px solid transparent;
    }

    .dash-tab:hover {
      background: var(--bg-surface-hover);
    }

    .dash-tab.active {
      background: var(--accent-subtle);
      border-left-color: var(--accent);
    }

    .dash-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-tertiary);
      transition: color 0.15s;
    }

    .dash-tab.active .dash-name {
      color: var(--text-primary);
    }

    .dash-meta {
      font-size: 9px;
      color: var(--text-quaternary);
      margin-top: 2px;
    }

    .loading,
    .empty {
      font-size: 11px;
      color: var(--text-quaternary);
      padding: 12px;
      text-align: center;
    }
  `]
})
export class DashboardListComponent {
  readonly dashboards = input.required<DashboardItem[]>();
  readonly activeDashboardId = input<string>('');
  readonly loading = input(false);

  readonly selected = output<string>();
}
