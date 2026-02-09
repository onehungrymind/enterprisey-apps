import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';
import { FilterChipComponent } from '@proto/ui-theme';
import { SourceCardComponent, SourceData } from '../source-card/source-card.component';

interface FilterOption {
  key: string;
  label: string;
}

@Component({
  selector: 'proto-source-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilterChipComponent, SourceCardComponent],
  template: `
    <div class="source-list-panel" data-testid="source-list-panel">
      <!-- Summary Stats -->
      <div class="stats-bar" data-testid="sources-stats-bar">
        <div class="stat" data-testid="stat-total-records">
          <div class="stat-label">Total Records</div>
          <div class="stat-value accent">{{ formattedTotalRecords() }}</div>
        </div>
        <div class="stat" data-testid="stat-active">
          <div class="stat-label">Active</div>
          <div class="stat-value success">{{ activeCount() }}</div>
        </div>
        <div class="stat" data-testid="stat-errors">
          <div class="stat-label">Errors</div>
          <div class="stat-value" [class.danger]="errorCount() > 0">{{ errorCount() }}</div>
        </div>
        <div class="stat" data-testid="stat-sources-count">
          <div class="stat-label">Sources</div>
          <div class="stat-value">{{ sources().length }}</div>
        </div>
      </div>

      <!-- Filter Chips -->
      <div class="filter-bar" data-testid="sources-filter-bar">
        @for (filter of filterOptions; track filter.key) {
          <ui-filter-chip
            [active]="filterType() === filter.key"
            (clicked)="filterType.set(filter.key)"
            [attr.data-testid]="'filter-' + filter.key"
          >
            {{ filter.label }}
          </ui-filter-chip>
        }
      </div>

      <!-- Source Cards -->
      <div class="sources-scroll" data-testid="sources-scroll">
        @for (source of filteredSources(); track source.id; let i = $index) {
          <div class="source-card-wrapper" [style.animation-delay]="i * 0.05 + 's'" [attr.data-testid]="'source-wrapper-' + source.id">
            <proto-source-card
              [source]="source"
              [isSelected]="selectedId() === source.id"
              (select)="selected.emit(source)"
            />
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .source-list-panel {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .stats-bar {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      gap: 16px;
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 8px;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .stat-value {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-secondary);
      font-family: 'JetBrains Mono', monospace;
    }

    .stat-value.accent {
      color: var(--accent);
    }

    .stat-value.success {
      color: var(--color-success);
    }

    .stat-value.danger {
      color: var(--color-danger);
    }

    .filter-bar {
      padding: 10px 18px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
    }

    .sources-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .source-card-wrapper {
      animation: slideUp 0.4s ease both;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class SourceListComponent {
  readonly sources = input.required<SourceData[]>();
  readonly selectedId = input<string | null>(null);

  readonly selected = output<SourceData>();

  protected readonly filterType = signal('all');

  protected readonly filterOptions: FilterOption[] = [
    { key: 'all', label: 'All' },
    { key: 'database', label: '\u26C1 DB' },
    { key: 'rest_api', label: '\u21C4 API' },
    { key: 'csv_file', label: '\u25A4 CSV' },
    { key: 'webhook', label: '\u26A1 Hook' },
  ];

  protected readonly filteredSources = computed(() => {
    const type = this.filterType();
    if (type === 'all') {
      return this.sources();
    }
    return this.sources().filter(s => s.type === type);
  });

  protected readonly totalRecords = computed(() =>
    this.sources().reduce((sum, s) => sum + s.recordsIngested, 0)
  );

  protected readonly formattedTotalRecords = computed(() => {
    const total = this.totalRecords();
    if (total >= 1_000_000) {
      return (total / 1_000_000).toFixed(1) + 'M';
    }
    if (total >= 1_000) {
      return Math.round(total / 1_000) + 'K';
    }
    return total.toString();
  });

  protected readonly activeCount = computed(() =>
    this.sources().filter(s => s.status === 'connected' || s.status === 'syncing').length
  );

  protected readonly errorCount = computed(() =>
    this.sources().filter(s => s.status === 'error').length
  );
}
