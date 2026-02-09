import { Component, ChangeDetectionStrategy, input, signal, computed, inject, effect } from '@angular/core';
import {
  WidgetComponent,
  MetricCardComponent,
} from '@proto/ui-theme';
import { DashboardsStore, WidgetsStore } from '@proto/reporting-state';
import { Widget, QueryResult } from '@proto/api-interfaces';
import {
  AreaChartComponent,
  DonutChartComponent,
  SimpleBarChartComponent,
  CustomerTableComponent,
  DataPoint,
  DonutSegment,
  SimpleBarData,
  CustomerData,
} from '../../components';

interface MetricData {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  sparkline: number[];
}

@Component({
  selector: 'proto-dashboard-viewer',
  standalone: true,
  imports: [
    WidgetComponent,
    MetricCardComponent,
    AreaChartComponent,
    DonutChartComponent,
    SimpleBarChartComponent,
    CustomerTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div class="loading-state">Loading dashboard...</div>
    } @else if (widgets().length === 0) {
      <div class="empty-state">
        <div class="empty-title">No widgets configured</div>
        <div class="empty-subtitle">Add widgets to this dashboard to visualize your data.</div>
      </div>
    } @else {
      <!-- Metric Cards Row -->
      @if (metricWidgets().length > 0) {
        <div class="metrics-grid">
          @for (widget of metricWidgets(); track widget.id; let i = $index) {
            @let data = getWidgetData(widget);
            <ui-metric-card
              [label]="widget.title"
              [value]="data.value"
              [change]="data.change"
              [positive]="data.positive"
              [sparkline]="data.sparkline"
              [style.animation-delay]="i * 0.08 + 's'"
              class="animate-fade-up"
            />
          }
        </div>
      }

      <!-- Chart Widgets Grid -->
      <div class="widget-grid">
        @for (widget of chartWidgets(); track widget.id) {
          <ui-widget
            [title]="widget.title"
            [span]="getWidgetSpan(widget)"
          >
            @switch (widget.type) {
              @case ('line_chart') {
                <app-area-chart
                  [data]="getLineChartData(widget)"
                  [height]="180"
                />
              }
              @case ('bar_chart') {
                <app-simple-bar-chart
                  [data]="getBarChartData(widget)"
                  [height]="140"
                />
              }
              @case ('pie_chart') {
                <div class="centered">
                  <app-donut-chart [data]="getPieChartData(widget)" />
                </div>
              }
              @case ('table') {
                <app-customer-table [customers]="getTableData(widget)" />
              }
              @case ('text') {
                <div class="text-widget">{{ getTextContent(widget) }}</div>
              }
              @default {
                <div class="widget-placeholder">
                  Widget type "{{ widget.type }}" not implemented
                </div>
              }
            }
            @if (isWidgetLoading(widget)) {
              <div class="widget-loading-overlay">
                <div class="spinner"></div>
              </div>
            }
          </ui-widget>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .loading-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      color: var(--text-tertiary);
    }

    .empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .empty-subtitle {
      font-size: 13px;
      color: var(--text-quaternary);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .widget-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: masonry;
      gap: 12px;
      align-items: start;
    }

    .centered {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .text-widget {
      padding: 16px;
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .widget-placeholder {
      padding: 20px;
      text-align: center;
      color: var(--text-quaternary);
      font-size: 12px;
    }

    .widget-loading-overlay {
      position: absolute;
      inset: 0;
      background: var(--bg-surface);
      opacity: 0.8;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid var(--border-default);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .animate-fade-up {
      animation: fadeUp 0.4s ease both;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1400px) {
      .metrics-grid { grid-template-columns: repeat(2, 1fr); }
      .widget-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 900px) {
      .metrics-grid { grid-template-columns: 1fr; }
      .widget-grid { grid-template-columns: 1fr; }
      .widget-grid > * { grid-column: span 1 !important; }
    }
  `]
})
export class DashboardViewerComponent {
  readonly dashboardId = input<string>();
  readonly dateRange = input<string>('12m');

  private readonly dashboardsStore = inject(DashboardsStore);
  private readonly widgetsStore = inject(WidgetsStore);

  protected readonly loading = computed(() => this.widgetsStore.loading());
  protected readonly widgets = computed(() => this.widgetsStore.currentWidgets());

  // Separate metric widgets from chart widgets
  protected readonly metricWidgets = computed(() =>
    this.widgets().filter(w => w.type === 'metric')
  );

  protected readonly chartWidgets = computed(() =>
    this.widgets().filter(w => w.type !== 'metric')
  );

  constructor() {
    // Load widgets when dashboardId changes
    effect(() => {
      const id = this.dashboardId();
      if (id) {
        this.widgetsStore.loadForDashboard(id).then(() => {
          // Execute queries for all widgets after loading
          this.widgetsStore.executeAllWidgetQueries();
        });
      }
    });
  }

  protected getWidgetSpan(widget: Widget): number {
    // Use position.w if available, default based on type
    if (widget.position?.w) {
      return Math.min(widget.position.w, 3);
    }
    // Default spans by type
    if (widget.type === 'line_chart' || widget.type === 'table') {
      return 2;
    }
    return 1;
  }

  protected isWidgetLoading(widget: Widget): boolean {
    const data = this.widgetsStore.getWidgetData()(widget.id!);
    return data.loading;
  }

  protected getWidgetQueryResult(widget: Widget): QueryResult | null {
    const data = this.widgetsStore.getWidgetData()(widget.id!);
    return data.queryResult;
  }

  // Metric widget data extraction
  protected getWidgetData(widget: Widget): MetricData {
    const result = this.getWidgetQueryResult(widget);
    const config = widget.config || {};

    if (result && result.rows.length > 0) {
      // For metric widgets, we need to aggregate all rows or pick the right value field
      // The valueField should be a numeric column (not the groupBy column)
      const numericColumns = result.columns.filter(col => {
        const firstRow = result.rows[0];
        return typeof firstRow[col] === 'number';
      });
      const valueKey = config['valueField'] || numericColumns[0] || result.columns[1] || result.columns[0];

      // If aggregation is 'sum', sum all rows; otherwise use first row
      let rawValue: number;
      if (config['aggregation'] === 'sum') {
        rawValue = result.rows.reduce((sum, row) => sum + (Number(row[valueKey]) || 0), 0);
      } else {
        rawValue = Number(result.rows[0][valueKey]) || 0;
      }

      return {
        label: widget.title,
        value: this.formatValue(rawValue, config['format']),
        change: config['change'] || '+12.5%',
        positive: config['positive'] !== false,
        sparkline: this.extractSparkline(result, config),
      };
    }

    // Default fallback data
    return {
      label: widget.title,
      value: config['defaultValue'] || '--',
      change: config['change'] || '+0%',
      positive: config['positive'] !== false,
      sparkline: [],
    };
  }

  // Line/Area chart data
  protected getLineChartData(widget: Widget): DataPoint[] {
    const result = this.getWidgetQueryResult(widget);
    const config = widget.config || {};

    if (result && result.rows.length > 0) {
      const labelField = config['labelField'] || result.columns[0];
      const valueField = config['valueField'] || result.columns[1] || result.columns[0];

      return result.rows.map(row => ({
        month: String(row[labelField] || ''),
        value: Number(row[valueField]) || 0,
      }));
    }

    // Sample fallback data
    return [
      { month: 'Jan', value: 100 },
      { month: 'Feb', value: 120 },
      { month: 'Mar', value: 115 },
      { month: 'Apr', value: 140 },
    ];
  }

  // Bar chart data
  protected getBarChartData(widget: Widget): SimpleBarData[] {
    const result = this.getWidgetQueryResult(widget);
    const config = widget.config || {};

    if (result && result.rows.length > 0) {
      const labelField = config['labelField'] || config['xAxis'] || result.columns[0];
      // Find the first numeric column that's not the label field
      const numericColumns = result.columns.filter(col => {
        const firstRow = result.rows[0];
        return typeof firstRow[col] === 'number' && col !== labelField;
      });
      const valueField = config['valueField'] || config['yAxis'] || numericColumns[0] || result.columns[1];

      return result.rows.map(row => ({
        label: String(row[labelField] || ''),
        value: Number(row[valueField]) || 0,
      }));
    }

    return [];
  }

  // Pie/Donut chart data
  protected getPieChartData(widget: Widget): DonutSegment[] {
    const result = this.getWidgetQueryResult(widget);
    const config = widget.config || {};
    const colors = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5'];

    if (result && result.rows.length > 0) {
      const labelField = config['labelField'] || result.columns[0];
      const valueField = config['valueField'] || result.columns[1] || result.columns[0];

      return result.rows.map((row, i) => ({
        label: String(row[labelField] || `Segment ${i + 1}`),
        value: Number(row[valueField]) || 0,
        colorVar: colors[i % colors.length],
      }));
    }

    return [];
  }

  // Table data
  protected getTableData(widget: Widget): CustomerData[] {
    const result = this.getWidgetQueryResult(widget);
    const config = widget.config || {};

    if (result && result.rows.length > 0) {
      return result.rows.map(row => ({
        name: String(row['name'] || row[result.columns[0]] || ''),
        arr: Number(row['arr'] || row['revenue'] || row[result.columns[1]] || 0),
        health: Number(row['health'] || row['score'] || 80),
        growth: Number(row['growth'] || row['change'] || 0),
      }));
    }

    return [];
  }

  // Text widget content
  protected getTextContent(widget: Widget): string {
    const config = widget.config || {};
    return config['content'] || config['text'] || 'No content configured';
  }

  private formatValue(value: any, format?: string): string {
    if (value === null || value === undefined) return '--';

    const num = Number(value);
    if (isNaN(num)) return String(value);

    switch (format) {
      case 'currency':
        if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
        return `$${num.toFixed(0)}`;
      case 'percent':
        return `${num.toFixed(1)}%`;
      case 'number':
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
      default:
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return String(num);
    }
  }

  private extractSparkline(result: QueryResult, config: any): number[] {
    const valueField = config['valueField'] || result.columns[1] || result.columns[0];
    return result.rows.slice(0, 12).map(row => Number(row[valueField]) || 0);
  }
}
