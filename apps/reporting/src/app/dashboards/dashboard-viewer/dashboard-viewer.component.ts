import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import {
  WidgetComponent,
  MetricCardComponent,
} from '@proto/ui-theme';
import {
  AreaChartComponent,
  DonutChartComponent,
  BarChartComponent,
  CustomerTableComponent,
  PipelinePerformanceComponent,
  SystemHealthComponent,
  DataPoint,
  DonutSegment,
  ActivityData,
  CustomerData,
  PipelineData,
  SystemHealthData,
} from '../../components';

@Component({
  selector: 'proto-dashboard-viewer',
  standalone: true,
  imports: [
    WidgetComponent,
    MetricCardComponent,
    AreaChartComponent,
    DonutChartComponent,
    BarChartComponent,
    CustomerTableComponent,
    PipelinePerformanceComponent,
    SystemHealthComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Metrics Cards -->
    <div class="metrics-grid">
      @for (metric of metrics(); track metric.label; let i = $index) {
        <ui-metric-card
          [label]="metric.label"
          [value]="metric.value"
          [change]="metric.change"
          [positive]="metric.positive"
          [sparkline]="metric.sparkline"
          [style.animation-delay]="i * 0.08 + 's'"
          class="animate-fade-up"
        />
      }
    </div>

    <!-- Widget Grid -->
    <div class="widget-grid">
      <!-- Revenue Trend - span 2 -->
      <ui-widget title="Revenue Trend" [span]="2">
        <app-area-chart [data]="revenueData()" [height]="180" />
      </ui-widget>

      <!-- Customer Segments -->
      <ui-widget title="Customer Segments">
        <div class="centered">
          <app-donut-chart [data]="segmentData()" />
        </div>
      </ui-widget>

      <!-- Top Customers - span 2 -->
      <ui-widget title="Top Customers by ARR" [span]="2">
        <app-customer-table [customers]="customerData()" />
      </ui-widget>

      <!-- Developer Activity -->
      <ui-widget title="Developer Activity">
        <app-bar-chart [data]="activityData()" [height]="140" />
      </ui-widget>

      <!-- Pipeline Performance - span 2 -->
      <ui-widget title="Pipeline Performance" [span]="2">
        <app-pipeline-performance [pipelines]="pipelineData()" />
      </ui-widget>

      <!-- System Health -->
      <ui-widget title="System Health">
        <app-system-health [systems]="systemHealthData()" />
      </ui-widget>
    </div>
  `,
  styles: [`
    :host {
      display: block;
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
      gap: 12px;
      grid-auto-rows: minmax(200px, auto);
    }

    .centered {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .animate-fade-up {
      animation: fadeUp 0.4s ease both;
    }

    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 1400px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .widget-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 900px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .widget-grid {
        grid-template-columns: 1fr;
      }

      .widget-grid > * {
        grid-column: span 1 !important;
      }
    }
  `]
})
export class DashboardViewerComponent {
  readonly dashboardId = input<string>();

  // Metrics data
  protected readonly metrics = signal([
    {
      label: 'Monthly Revenue',
      value: '$598K',
      change: '+10.3%',
      positive: true,
      sparkline: [284, 312, 298, 345, 378, 420, 395, 467, 510, 485, 542, 598]
    },
    {
      label: 'Active Customers',
      value: '2,847',
      change: '+142',
      positive: true,
      sparkline: [2200, 2340, 2510, 2650, 2780, 2847]
    },
    {
      label: 'Avg. Deal Size',
      value: '$18.4K',
      change: '-2.1%',
      positive: false,
      sparkline: [21000, 20200, 19400, 18800, 18500, 18400]
    },
    {
      label: 'Churn Rate',
      value: '1.8%',
      change: '-0.4%',
      positive: true,
      sparkline: [3.2, 2.7, 2.3, 2.0, 1.9, 1.8]
    }
  ]);

  // Revenue chart data
  protected readonly revenueData = signal<DataPoint[]>([
    { month: 'Aug', value: 284000 },
    { month: 'Sep', value: 312000 },
    { month: 'Oct', value: 298000 },
    { month: 'Nov', value: 345000 },
    { month: 'Dec', value: 378000 },
    { month: 'Jan', value: 420000 },
    { month: 'Feb', value: 395000 },
    { month: 'Mar', value: 467000 },
    { month: 'Apr', value: 510000 },
    { month: 'May', value: 485000 },
    { month: 'Jun', value: 542000 },
    { month: 'Jul', value: 598000 }
  ]);

  // Segment donut chart data
  protected readonly segmentData = signal<DonutSegment[]>([
    { label: 'Enterprise', value: 42, colorVar: '--chart-1' },
    { label: 'Pro', value: 31, colorVar: '--chart-2' },
    { label: 'Starter', value: 18, colorVar: '--chart-3' },
    { label: 'Free', value: 9, colorVar: '--chart-4' }
  ]);

  // Activity bar chart data
  protected readonly activityData = signal<ActivityData[]>([
    { day: 'Mon', commits: 142, prs: 23, deploys: 8 },
    { day: 'Tue', commits: 198, prs: 31, deploys: 12 },
    { day: 'Wed', commits: 167, prs: 28, deploys: 6 },
    { day: 'Thu', commits: 224, prs: 35, deploys: 14 },
    { day: 'Fri', commits: 189, prs: 29, deploys: 11 },
    { day: 'Sat', commits: 45, prs: 4, deploys: 2 },
    { day: 'Sun', commits: 32, prs: 2, deploys: 1 }
  ]);

  // Customer table data
  protected readonly customerData = signal<CustomerData[]>([
    { name: 'Acme Corp', arr: 240000, health: 92, growth: 12.4 },
    { name: 'Globex Industries', arr: 186000, health: 88, growth: 8.2 },
    { name: 'Initech', arr: 156000, health: 95, growth: 22.1 },
    { name: 'Soylent Corp', arr: 132000, health: 71, growth: -3.4 },
    { name: 'Umbrella Corp', arr: 118000, health: 84, growth: 5.7 },
    { name: 'Wayne Enterprises', arr: 98000, health: 96, growth: 31.2 },
    { name: 'Stark Industries', arr: 87000, health: 79, growth: 1.1 }
  ]);

  // Pipeline performance data
  protected readonly pipelineData = signal<PipelineData[]>([
    { name: 'Customer 360', success: 99.8, runs: 48 },
    { name: 'Payment Recon', success: 100, runs: 96 },
    { name: 'Event Stream', success: 99.9, runs: 2847 },
    { name: 'Lead Scoring', success: 0, runs: 0 },
    { name: 'Warehouse Sync', success: 75.0, runs: 12 }
  ]);

  // System health data
  protected readonly systemHealthData = signal<SystemHealthData[]>([
    { label: 'Ingress', status: 'Healthy', uptime: '99.97%' },
    { label: 'Transform', status: 'Healthy', uptime: '99.99%' },
    { label: 'Reporting', status: 'Healthy', uptime: '100%' },
    { label: 'Export', status: 'Degraded', uptime: '98.2%' },
    { label: 'Users API', status: 'Healthy', uptime: '99.95%' }
  ]);
}
