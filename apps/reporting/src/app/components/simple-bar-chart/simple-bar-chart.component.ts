import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface SimpleBarData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-simple-bar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-container" [style.height.px]="height()">
      <div class="bars">
        @for (item of normalizedData(); track item.label; let i = $index) {
          <div class="bar-group">
            <div class="bar-wrapper">
              <div
                class="bar"
                [style.height.%]="item.heightPercent"
                [style.background]="getBarColor(i)"
              >
                <span class="value-label" [class.inside]="item.heightPercent > 30">
                  {{ formatValue(item.value) }}
                </span>
              </div>
            </div>
            <span class="label">{{ item.label }}</span>
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
      display: flex;
      flex-direction: column;
    }

    .bars {
      flex: 1;
      display: flex;
      align-items: flex-end;
      gap: 6px;
      padding-bottom: 24px;
    }

    .bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      min-width: 0;
    }

    .bar-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .bar {
      width: 100%;
      max-width: 32px;
      border-radius: 4px 4px 0 0;
      position: relative;
      transition: opacity 0.2s;
      min-height: 4px;
    }

    .bar:hover {
      opacity: 0.85;
    }

    .value-label {
      position: absolute;
      top: -18px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 9px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-tertiary);
      white-space: nowrap;
    }

    .value-label.inside {
      top: 4px;
      color: rgba(255, 255, 255, 0.9);
    }

    .label {
      font-size: 9px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
      position: absolute;
      bottom: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
  `]
})
export class SimpleBarChartComponent {
  readonly data = input.required<SimpleBarData[]>();
  readonly height = input(140);
  readonly colorVar = input('--accent');

  private readonly colors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ];

  protected readonly normalizedData = computed(() => {
    const d = this.data();
    if (!d.length) return [];

    const max = Math.max(...d.map(item => item.value), 1);

    return d.map(item => ({
      ...item,
      heightPercent: (item.value / max) * 100,
    }));
  });

  protected getBarColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  protected formatValue(value: number): string {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  }
}
