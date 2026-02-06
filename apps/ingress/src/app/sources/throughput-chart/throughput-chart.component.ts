import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface ThroughputDataPoint {
  time: string;
  value: number;
}

@Component({
  selector: 'proto-throughput-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-container">
      <!-- Y-axis labels and grid lines -->
      @for (pct of gridLines; track pct) {
        <div
          class="grid-line"
          [style.top.px]="(1 - pct) * (chartHeight - 20)"
        >
          <span class="y-label">{{ getYLabel(pct) }}</span>
        </div>
      }

      <!-- Bars -->
      <div class="bars-container">
        @for (point of data(); track point.time; let i = $index) {
          @let barHeight = getBarHeight(point.value);
          <div class="bar-wrapper">
            <div
              class="bar"
              [style.height.px]="barHeight"
            ></div>
            @if (showTimeLabel(point.time)) {
              <span class="x-label">{{ point.time }}</span>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .chart-container {
      position: relative;
      height: 120px;
      padding: 0 0 20px 40px;
    }

    .grid-line {
      position: absolute;
      left: 40px;
      right: 0;
      border-bottom: 1px solid var(--border-subtle);
    }

    .y-label {
      position: absolute;
      left: -40px;
      top: -6px;
      font-size: 9px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
      width: 36px;
      text-align: right;
    }

    .bars-container {
      display: flex;
      align-items: flex-end;
      height: 100px;
      gap: 3px;
    }

    .bar-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      position: relative;
    }

    .bar {
      width: 100%;
      max-width: 28px;
      border-radius: 3px 3px 0 0;
      background: linear-gradient(to top, var(--bar-from), var(--bar-to));
      opacity: 0.85;
      transition: height 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s;
    }

    .bar:hover {
      opacity: 1;
      filter: brightness(1.1);
    }

    .x-label {
      font-size: 8px;
      color: var(--text-ghost);
      font-family: 'JetBrains Mono', monospace;
      position: absolute;
      bottom: -16px;
    }
  `]
})
export class ThroughputChartComponent {
  readonly data = input.required<ThroughputDataPoint[]>();

  protected readonly chartHeight = 120;
  protected readonly gridLines = [0, 0.25, 0.5, 0.75, 1];

  protected readonly maxValue = computed(() => {
    const values = this.data().map(d => d.value);
    return Math.max(...values, 1);
  });

  protected getYLabel(pct: number): string {
    const val = Math.round(this.maxValue() * pct / 1000);
    return val + 'k';
  }

  protected getBarHeight(value: number): number {
    const max = this.maxValue();
    return (value / max) * (this.chartHeight - 20);
  }

  protected showTimeLabel(time: string): boolean {
    return time.split(':')[1] === '00';
  }
}
