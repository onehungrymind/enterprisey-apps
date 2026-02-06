import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import {
  ThemeService,
  ThemeToggleComponent,
  PageHeaderComponent,
  FilterChipComponent,
  ActionButtonComponent,
} from '@proto/ui-theme';
import { inject } from '@angular/core';

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
            [activeDashboardId]="activeDashboardId()"
            [loading]="loading()"
            (selected)="selectDashboard($event)"
          />
        </aside>

        <!-- Content Area -->
        <main class="content">
          <proto-dashboard-viewer [dashboardId]="activeDashboardId()" />
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
export class DashboardsComponent {
  protected readonly themeService = inject(ThemeService);

  // State
  protected readonly loading = signal(false);
  protected readonly activeDashboardId = signal('db-001');
  protected readonly selectedRange = signal<DateRange>('12m');

  // Date range options
  protected readonly dateRanges: DateRange[] = ['7d', '30d', '90d', '12m'];

  // Mock dashboard data
  protected readonly dashboards = signal<DashboardItem[]>([
    { id: 'db-001', name: 'Revenue Overview', widgets: 8, updatedAt: '2 min ago' },
    { id: 'db-002', name: 'Customer Health', widgets: 6, updatedAt: '1 hour ago' },
    { id: 'db-003', name: 'Developer Activity', widgets: 5, updatedAt: '15 min ago' },
    { id: 'db-004', name: 'Pipeline Performance', widgets: 4, updatedAt: '30 min ago' },
  ]);

  // Selected dashboard
  protected readonly selectedDashboard = computed(() => {
    const id = this.activeDashboardId();
    return this.dashboards().find(d => d.id === id);
  });

  protected selectDashboard(id: string): void {
    this.activeDashboardId.set(id);
  }

  protected selectRange(range: DateRange): void {
    this.selectedRange.set(range);
  }

  protected createDashboard(): void {
    // TODO: Implement dashboard creation
    console.log('Create new dashboard');
  }
}
