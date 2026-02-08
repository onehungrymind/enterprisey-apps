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
import { ChartSegment, DEFAULT_CHART_COLORS } from '../../interfaces/chart.interfaces';

Chart.register(...registerables);

@Component({
  selector: 'ui-donut-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas></canvas>`,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    canvas { width: 100% !important; height: 100% !important; }
  `],
})
export class DonutChartComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | null = null;

  /** Chart segments */
  readonly data = input.required<ChartSegment[]>();

  /** Cutout percentage (0 = pie, 50+ = donut) */
  readonly cutout = input<number>(65);

  /** Show legend */
  readonly showLegend = input<boolean>(true);

  /** Colors for segments */
  readonly colors = input<string[]>(DEFAULT_CHART_COLORS);

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

    const colors = this.colors();
    const backgroundColors = data.map((segment, i) =>
      segment.color
        ? this.resolveCssColor(segment.color)
        : this.resolveCssColor(colors[i % colors.length])
    );

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: backgroundColors,
          borderWidth: 0,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: `${this.cutout()}%`,
        plugins: {
          legend: {
            display: this.showLegend(),
            position: 'right',
            labels: {
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: 'circle',
              color: 'var(--text-tertiary, #999)',
              font: { family: "'DM Sans', sans-serif", size: 10 },
              padding: 8,
              generateLabels: (chart) => {
                const dataset = chart.data.datasets[0];
                const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);
                return chart.data.labels?.map((label, i) => ({
                  text: `${label} ${Math.round(((dataset.data[i] as number) / total) * 100)}%`,
                  fillStyle: (dataset.backgroundColor as string[])[i],
                  strokeStyle: (dataset.backgroundColor as string[])[i],
                  lineWidth: 0,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i,
                })) || [];
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { family: "'DM Sans', sans-serif", size: 11 },
            bodyFont: { family: "'JetBrains Mono', monospace", size: 12 },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (context) => {
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = Math.round((context.parsed / total) * 100);
                return ` ${context.label}: ${percentage}%`;
              },
            },
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

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
