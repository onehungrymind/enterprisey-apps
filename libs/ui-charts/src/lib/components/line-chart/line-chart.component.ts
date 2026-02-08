import {
  Component,
  ChangeDetectionStrategy,
  input,
  effect,
  viewChild,
  ElementRef,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ChartDataPoint, LineChartConfig, DEFAULT_CHART_COLORS } from '../../interfaces/chart.interfaces';

Chart.register(...registerables);

@Component({
  selector: 'ui-line-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas></canvas>`,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    canvas { width: 100% !important; height: 100% !important; }
  `],
})
export class LineChartComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | null = null;

  /** Chart data points */
  readonly data = input.required<ChartDataPoint[]>();

  /** Line color */
  readonly color = input<string>(DEFAULT_CHART_COLORS[0]);

  /** Fill area under line */
  readonly fill = input<boolean>(true);

  /** Show grid lines */
  readonly showGrid = input<boolean>(true);

  /** Show X axis labels */
  readonly showXAxis = input<boolean>(true);

  /** Show Y axis */
  readonly showYAxis = input<boolean>(false);

  /** Line tension (0 = straight, 0.4 = curved) */
  readonly tension = input<number>(0.3);

  constructor() {
    effect(() => {
      const data = this.data();
      if (isPlatformBrowser(this.platformId) && data.length > 0) {
        this.renderChart();
      }
    });
  }

  private renderChart(): void {
    const canvas = this.canvasRef()?.nativeElement;
    const data = this.data();
    if (!canvas || data.length === 0) return;

    const resolvedColor = this.resolveCssColor(this.color());

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight || 200);
    gradient.addColorStop(0, this.hexToRgba(resolvedColor, 0.3));
    gradient.addColorStop(1, this.hexToRgba(resolvedColor, 0));

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          borderColor: resolvedColor,
          borderWidth: 2,
          fill: this.fill(),
          backgroundColor: this.fill() ? gradient : undefined,
          tension: this.tension(),
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: resolvedColor,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { family: "'DM Sans', sans-serif", size: 11 },
            bodyFont: { family: "'JetBrains Mono', monospace", size: 12 },
            padding: 10,
            cornerRadius: 6,
          },
        },
        scales: {
          x: {
            display: this.showXAxis(),
            grid: { display: false },
            ticks: {
              color: 'var(--text-ghost, #666)',
              font: { family: "'JetBrains Mono', monospace", size: 9 },
            },
          },
          y: {
            display: this.showYAxis(),
            grid: {
              display: this.showGrid(),
              color: 'rgba(255,255,255,0.05)',
            },
            ticks: {
              color: 'var(--text-ghost, #666)',
              font: { family: "'JetBrains Mono', monospace", size: 9 },
            },
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        animation: { duration: 300 },
      },
    });
  }

  private resolveCssColor(color: string): string {
    if (!color.startsWith('var(')) return color;
    const match = color.match(/var\(([^,)]+)(?:,\s*([^)]+))?\)/);
    if (!match) return color;
    const varName = match[1].trim();
    const fallback = match[2]?.trim() || '#8b5cf6';
    if (isPlatformBrowser(this.platformId)) {
      const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      return computed || fallback;
    }
    return fallback;
  }

  private hexToRgba(hex: string, alpha: number): string {
    if (hex.startsWith('rgb')) return hex;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return hex;
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
