import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import {
  ThemeService,
  ThemeToggleComponent,
  PageHeaderComponent,
  FilterChipComponent,
  ActionButtonComponent,
} from '@proto/ui-theme';
import { DashboardsStore } from '@proto/reporting-state';

import { DashboardListComponent, DashboardItem } from './dashboard-list/dashboard-list.component';
import { DashboardViewerComponent } from './dashboard-viewer/dashboard-viewer.component';

type DateRange = '7d' | '30d' | '90d' | '12m';

@Component({
  selector: 'proto-dashboards',
  standalone: true,
  imports: [
    ThemeToggleComponent,
    PageHeaderComponent,
    FilterChipComponent,
    ActionButtonComponent,
    DashboardListComponent,
    DashboardViewerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-shell">
      <!-- Header -->
      <ui-page-header title="Reporting" subtitle="Dashboards">
        <div slot="actions" class="header-actions">
          <!-- Date Range Filters -->
          @for (range of dateRanges; track range) {
            <ui-filter-chip
              [active]="range === selectedRange()"
              (clicked)="selectRange(range)"
            >
              {{ range.toUpperCase() }}
            </ui-filter-chip>
          }

          <div class="divider"></div>

          <ui-action-button variant="primary" (clicked)="createDashboard()">
            + New Dashboard
          </ui-action-button>

          <ui-theme-toggle />
        </div>
      </ui-page-header>

      <!-- Main Layout -->
      <div class="main-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
          <proto-dashboard-list
            [dashboards]="dashboards()"
            [activeDashboardId]="activeDashboardId() ?? ''"
            [loading]="loading()"
            (selected)="selectDashboard($event)"
          />
        </aside>

        <!-- Content Area -->
        <main class="content">
          @if (activeDashboardId(); as dashboardId) {
            <proto-dashboard-viewer [dashboardId]="dashboardId" />
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    .app-shell {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--bg-root);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .divider {
      width: 1px;
      height: 20px;
      background: var(--border-default);
      margin: 0 4px;
    }

    .main-layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .sidebar {
      width: 220px;
      border-right: 1px solid var(--border-default);
      overflow-y: auto;
      flex-shrink: 0;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px;
    }

    @media (max-width: 900px) {
      .sidebar {
        display: none;
      }
    }
  `]
})
export class DashboardsComponent implements OnInit {
  protected readonly themeService = inject(ThemeService);
  protected readonly store = inject(DashboardsStore);

  // State
  protected readonly loading = computed(() => this.store.loading());
  protected readonly activeDashboardId = signal<string | null>(null);
  protected readonly selectedRange = signal<DateRange>('12m');

  // Date range options
  protected readonly dateRanges: DateRange[] = ['7d', '30d', '90d', '12m'];

  // Dashboard data from store, mapped to DashboardItem format
  protected readonly dashboards = computed<DashboardItem[]>(() => {
    return this.store.entities().map(d => ({
      id: d.id,
      name: d.name,
      widgets: d.widgets?.length || 0,
      updatedAt: this.formatRelativeTime(d),
    }));
  });

  // Selected dashboard
  protected readonly selectedDashboard = computed(() => {
    const id = this.activeDashboardId();
    return this.dashboards().find(d => d.id === id);
  });

  ngOnInit(): void {
    // Auto-select first dashboard when entities load
    const entities = this.store.entities();
    if (entities.length && !this.activeDashboardId()) {
      this.activeDashboardId.set(entities[0].id);
    }
  }

  protected selectDashboard(id: string): void {
    this.activeDashboardId.set(id);
    this.store.select(id);
  }

  protected selectRange(range: DateRange): void {
    this.selectedRange.set(range);
  }

  protected createDashboard(): void {
    console.log('Create new dashboard');
  }

  private formatRelativeTime(dashboard: { id: string }): string {
    // For now return a placeholder - in production, would use dashboard.updatedAt
    return 'Recently';
  }
}
