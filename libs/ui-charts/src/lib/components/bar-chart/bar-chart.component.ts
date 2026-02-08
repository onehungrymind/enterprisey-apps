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
import { MultiSeriesDataPoint, DEFAULT_CHART_COLORS } from '../../interfaces/chart.interfaces';

Chart.register(...registerables);

@Component({
  selector: 'ui-bar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas></canvas>`,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    canvas { width: 100% !important; height: 100% !important; }
  `],
})
export class BarChartComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | null = null;

  /** Chart data - label with multiple values */
  readonly data = input.required<MultiSeriesDataPoint[]>();

  /** Colors for each series */
  readonly colors = input<string[]>(DEFAULT_CHART_COLORS);

  /** Stacked bars */
  readonly stacked = input<boolean>(false);

  /** Show grid */
  readonly showGrid = input<boolean>(true);

  /** Show X axis labels */
  readonly showXAxis = input<boolean>(true);

  /** Bar border radius */
  readonly borderRadius = input<number>(4);

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

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Extract series keys from first data point
    const seriesKeys = Object.keys(data[0].values);
    const colors = this.colors();

    const datasets = seriesKeys.map((key, index) => ({
      label: key,
      data: data.map(d => d.values[key] || 0),
      backgroundColor: this.hexToRgba(this.resolveCssColor(colors[index % colors.length]), 0.8),
      borderColor: this.resolveCssColor(colors[index % colors.length]),
      borderWidth: 0,
      borderRadius: this.borderRadius(),
      borderSkipped: false as const,
    }));

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: seriesKeys.length > 1,
            position: 'bottom',
            labels: {
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: 'circle',
              color: 'var(--text-tertiary, #999)',
              font: { family: "'DM Sans', sans-serif", size: 10 },
              padding: 12,
            },
          },
          tooltip: {
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
            stacked: this.stacked(),
            ticks: {
              color: 'var(--text-ghost, #666)',
              font: { family: "'JetBrains Mono', monospace", size: 9 },
            },
          },
          y: {
            display: false,
            grid: { display: this.showGrid(), color: 'rgba(255,255,255,0.05)' },
            stacked: this.stacked(),
          },
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
