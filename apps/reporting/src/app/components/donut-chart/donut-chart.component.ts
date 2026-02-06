import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface DonutSegment {
  label: string;
  value: number;
  colorVar: string;
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="donut-container">
      <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 120 120">
        @for (segment of segments(); track segment.label) {
          <circle
            cx="60"
            cy="60"
            [attr.r]="radius"
            fill="none"
            [attr.stroke]="'var(' + segment.colorVar + ')'"
            stroke-width="14"
            [attr.stroke-dasharray]="segment.dashArray"
            [attr.transform]="'rotate(' + segment.rotation + ' 60 60)'"
            stroke-linecap="round"
          />
        }
        <text x="60" y="56" text-anchor="middle" class="total">{{ total() }}%</text>
        <text x="60" y="70" text-anchor="middle" class="subtitle">DISTRIBUTION</text>
      </svg>

      <div class="legend">
        @for (item of data(); track item.label) {
          <div class="legend-item">
            <div class="dot" [style.background]="'var(' + item.colorVar + ')'"></div>
            <span class="legend-label">{{ item.label }}</span>
            <span class="legend-value">{{ item.value }}%</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .donut-container {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    svg {
      flex-shrink: 0;
    }

    .total {
      font-size: 18px;
      font-weight: 700;
      fill: var(--text-primary);
      font-family: 'JetBrains Mono', monospace;
    }

    .subtitle {
      font-size: 8px;
      fill: var(--text-quaternary);
      letter-spacing: 0.08em;
    }

    .legend {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .legend-label {
      font-size: 11px;
      color: var(--text-tertiary);
      min-width: 70px;
    }

    .legend-value {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
      font-family: 'JetBrains Mono', monospace;
    }
  `]
})
export class DonutChartComponent {
  readonly data = input.required<DonutSegment[]>();
  readonly size = input(120);

  protected readonly radius = 42;
  private readonly circumference = 2 * Math.PI * this.radius;

  protected readonly total = computed(() => {
    return this.data().reduce((sum, d) => sum + d.value, 0);
  });

  protected readonly segments = computed(() => {
    const d = this.data();
    const t = this.total();
    let cumulative = 0;

    return d.map(segment => {
      const pct = segment.value / t;
      const dashArray = `${pct * this.circumference} ${this.circumference}`;
      const rotation = cumulative * 360 - 90;
      cumulative += pct;

      return {
        ...segment,
        dashArray,
        rotation
      };
    });
  });
}
