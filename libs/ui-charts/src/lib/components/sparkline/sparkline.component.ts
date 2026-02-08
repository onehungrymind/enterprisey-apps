import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  effect,
  viewChild,
  ElementRef,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SparklineData, SparklineConfig } from '../../interfaces/chart.interfaces';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'ui-sparkline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas></canvas>`,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    canvas { width: 100% !important; height: 100% !important; }
  `],
})
export class SparklineComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | null = null;

  /** Array of numeric values */
  readonly data = input.required<SparklineData>();

  /** Line color */
  readonly color = input<string>('var(--accent, #8b5cf6)');

  /** Fill area under line */
  readonly fill = input<boolean>(false);

  /** Line width */
  readonly lineWidth = input<number>(2);

  constructor() {
    // React to data/config changes
    effect(() => {
      const data = this.data();
      const color = this.color();
      const fill = this.fill();
      const lineWidth = this.lineWidth();

      if (isPlatformBrowser(this.platformId)) {
        this.renderChart(data, color, fill, lineWidth);
      }
    });
  }

  private renderChart(data: SparklineData, color: string, fill: boolean, lineWidth: number): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas || data.length === 0) return;

    // Resolve CSS variable to actual color
    const resolvedColor = this.resolveCssColor(color);

    // Destroy existing chart
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i.toString()),
        datasets: [{
          data: data,
          borderColor: resolvedColor,
          borderWidth: lineWidth,
          fill: fill,
          backgroundColor: fill ? this.hexToRgba(resolvedColor, 0.1) : undefined,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        animation: { duration: 0 },
        elements: {
          line: { borderCapStyle: 'round', borderJoinStyle: 'round' },
        },
      },
    });
  }

  private resolveCssColor(color: string): string {
    if (!color.startsWith('var(')) return color;

    // Extract variable name and fallback
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
    // Handle rgb/rgba
    if (hex.startsWith('rgb')) return hex;

    // Convert hex to rgba
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
