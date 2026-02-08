import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface DataPoint {
  month: string;
  value: number;
}

@Component({
  selector: 'app-area-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-container" [style.height.px]="height()">
      <svg [attr.viewBox]="'0 -4 ' + viewWidth + ' ' + (viewHeight + 8)" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <!-- Grid lines -->
        @for (line of gridLines; track line) {
          <line
            [attr.x1]="0"
            [attr.y1]="viewHeight - line * viewHeight"
            [attr.x2]="viewWidth"
            [attr.y2]="viewHeight - line * viewHeight"
            stroke="var(--border-subtle)"
            stroke-width="0.3"
          />
        }

        <!-- Area fill -->
        <path [attr.d]="areaPath()" fill="url(#areaGradient)"/>

        <!-- Line -->
        <path
          [attr.d]="linePath()"
          fill="none"
          stroke="var(--accent)"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />

        <!-- End point dot -->
        @if (lastPoint(); as point) {
          <circle
            [attr.cx]="point.x"
            [attr.cy]="point.y"
            r="1.5"
            fill="var(--accent)"
          />
        }
      </svg>

      <!-- X-axis labels -->
      <div class="labels">
        @for (label of xLabels(); track label) {
          <span class="label">{{ label }}</span>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .chart-container { position: relative; padding-bottom: 20px; }
    svg { width: 100%; height: 100%; display: block; }
    .labels { display: flex; justify-content: space-between; position: absolute; bottom: 0; left: 0; right: 0; }
    .label { font-size: 8px; color: var(--text-ghost); font-family: 'JetBrains Mono', monospace; }
  `]
})
export class AreaChartComponent {
  readonly data = input.required<DataPoint[]>();
  readonly height = input(160);

  protected readonly viewWidth = 100;
  protected readonly viewHeight = 100;
  protected readonly gridLines = [0, 0.25, 0.5, 0.75];

  protected readonly points = computed(() => {
    const d = this.data();
    if (d.length === 0) return [];

    const max = Math.max(...d.map(p => p.value)) * 1.1;
    return d.map((p, i) => ({
      x: (i / (d.length - 1)) * this.viewWidth,
      y: this.viewHeight - (p.value / max) * this.viewHeight
    }));
  });

  protected readonly linePath = computed(() => {
    const pts = this.points();
    if (pts.length === 0) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  });

  protected readonly areaPath = computed(() => {
    const line = this.linePath();
    if (!line) return '';
    return `${line} L ${this.viewWidth} ${this.viewHeight} L 0 ${this.viewHeight} Z`;
  });

  protected readonly lastPoint = computed(() => {
    const pts = this.points();
    return pts.length > 0 ? pts[pts.length - 1] : null;
  });

  protected readonly xLabels = computed(() => {
    const d = this.data();
    return d.filter((_, i) => i % 2 === 0).map(p => p.month);
  });
}
