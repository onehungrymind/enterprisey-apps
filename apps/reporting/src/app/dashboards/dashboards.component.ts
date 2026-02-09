import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, effect } from '@angular/core';
import {
  ThemeService,
  ThemeToggleComponent,
  PageHeaderComponent,
  FilterChipComponent,
  ActionButtonComponent,
} from '@proto/ui-theme';
import { DashboardsStore, WidgetsStore } from '@proto/reporting-state';

import { DashboardListComponent, DashboardItem } from './dashboard-list/dashboard-list.component';
import { DashboardViewerComponent } from './dashboard-viewer/dashboard-viewer.component';
import { CreateDashboardDialogComponent } from './create-dashboard-dialog/create-dashboard-dialog.component';

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
    CreateDashboardDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-shell" data-testid="reporting-app">
      <!-- Header -->
      <ui-page-header title="Reporting" subtitle="Dashboards">
        <div slot="actions" class="header-actions">
          <!-- Date Range Filters -->
          @for (range of dateRanges; track range) {
            <ui-filter-chip
              [active]="range === selectedRange()"
              (clicked)="selectRange(range)"
              [attr.data-testid]="'date-filter-' + range"
            >
              {{ range.toUpperCase() }}
            </ui-filter-chip>
          }

          <div class="divider"></div>

          <ui-action-button variant="primary" (clicked)="createDashboard()" data-testid="new-dashboard-button">
            + New Dashboard
          </ui-action-button>

          <ui-theme-toggle />
        </div>
      </ui-page-header>

      <!-- Main Layout -->
      <div class="main-layout">
        <!-- Sidebar -->
        <aside class="sidebar" data-testid="dashboards-sidebar">
          <proto-dashboard-list
            [dashboards]="dashboards()"
            [activeDashboardId]="activeDashboardId() ?? ''"
            [loading]="loading()"
            (selected)="selectDashboard($event)"
            data-testid="dashboards-list"
          />
        </aside>

        <!-- Content Area -->
        <main class="content" data-testid="dashboard-content">
          @if (activeDashboardId(); as dashboardId) {
            <proto-dashboard-viewer
              [dashboardId]="dashboardId"
              [dateRange]="selectedRange()"
              data-testid="dashboard-viewer"
            />
          }
        </main>
      </div>

      <!-- Create Dashboard Dialog -->
      @if (showCreateDialog()) {
        <proto-create-dashboard-dialog
          (created)="onDashboardCreated($event)"
          (cancelled)="showCreateDialog.set(false)"
          data-testid="create-dashboard-dialog"
        />
      }
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
  protected readonly widgetsStore = inject(WidgetsStore);

  // State
  protected readonly loading = computed(() => this.store.loading());
  protected readonly activeDashboardId = signal<string | null>(null);
  protected readonly selectedRange = signal<DateRange>('12m');
  protected readonly showCreateDialog = signal(false);

  // Date range options
  protected readonly dateRanges: DateRange[] = ['7d', '30d', '90d', '12m'];

  // Dashboard data from store, mapped to DashboardItem format
  protected readonly dashboards = computed<DashboardItem[]>(() => {
    const getWidgetCount = this.widgetsStore.getWidgetCount();
    return this.store.entities().map(d => ({
      id: d.id,
      name: d.name,
      widgets: getWidgetCount(d.id),
      updatedAt: this.formatRelativeTime(d),
    }));
  });

  // Selected dashboard
  protected readonly selectedDashboard = computed(() => {
    const id = this.activeDashboardId();
    return this.dashboards().find(d => d.id === id);
  });

  constructor() {
    // Preload widgets for all dashboards when dashboards are loaded
    effect(() => {
      const dashboards = this.store.entities();
      if (dashboards.length > 0) {
        // Load widgets for each dashboard to get counts
        dashboards.forEach(d => {
          this.widgetsStore.loadForDashboard(d.id);
        });
        // Auto-select first dashboard if none selected
        if (!this.activeDashboardId()) {
          this.activeDashboardId.set(dashboards[0].id);
        }
      }
    });
  }

  ngOnInit(): void {
    // Effect handles initial selection now
  }

  protected selectDashboard(id: string): void {
    this.activeDashboardId.set(id);
    this.store.select(id);
  }

  protected selectRange(range: DateRange): void {
    this.selectedRange.set(range);
  }

  protected createDashboard(): void {
    this.showCreateDialog.set(true);
  }

  protected async onDashboardCreated(data: { name: string; description: string }): Promise<void> {
    this.showCreateDialog.set(false);
    await this.store.create({
      name: data.name,
      description: data.description,
      widgets: [],
      filters: [],
      createdBy: 'user@example.com',
      isPublic: true,
    });
    // Select the newly created dashboard
    const entities = this.store.entities();
    if (entities.length > 0) {
      const newest = entities[entities.length - 1];
      this.activeDashboardId.set(newest.id);
    }
  }

  private formatRelativeTime(dashboard: { id: string }): string {
    // For now return a placeholder - in production, would use dashboard.updatedAt
    return 'Recently';
  }
}
