import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export interface ActivityData {
  day: string;
  commits: number;
  prs: number;
  deploys: number;
}

interface BarLegendItem {
  label: string;
  colorVar: string;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-container" [style.height.px]="height()">
      <div class="bars">
        @for (item of normalizedData(); track item.day; let i = $index) {
          <div class="bar-group">
            <div class="bar-stack">
              <div
                class="bar"
                [style.height.%]="item.commitsHeight"
                [style.background]="'var(--chart-bar-1)'"
              ></div>
              <div
                class="bar"
                [style.height.%]="item.prsHeight"
                [style.background]="'var(--chart-bar-2)'"
              ></div>
              <div
                class="bar"
                [style.height.%]="item.deploysHeight"
                [style.background]="'var(--chart-bar-3)'"
              ></div>
            </div>
            <span class="label">{{ item.day }}</span>
          </div>
        }
      </div>

      <div class="legend">
        @for (item of legendItems; track item.label) {
          <div class="legend-item">
            <div class="dot" [style.background]="'var(' + item.colorVar + ')'"></div>
            <span>{{ item.label }}</span>
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
      gap: 8px;
      padding-bottom: 20px;
    }

    .bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      position: relative;
    }

    .bar-stack {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 100%;
      width: 100%;
      justify-content: center;
    }

    .bar {
      width: 8px;
      border-radius: 2px 2px 0 0;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .bar:hover {
      opacity: 1;
    }

    .label {
      font-size: 8px;
      color: var(--text-ghost);
      font-family: 'JetBrains Mono', monospace;
      position: absolute;
      bottom: 0;
    }

    .legend {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 4px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 1px;
    }

    .legend-item span {
      font-size: 9px;
      color: var(--text-quaternary);
    }
  `]
})
export class BarChartComponent {
  readonly data = input.required<ActivityData[]>();
  readonly height = input(140);

  protected readonly legendItems: BarLegendItem[] = [
    { label: 'Commits', colorVar: '--chart-bar-1' },
    { label: 'PRs', colorVar: '--chart-bar-2' },
    { label: 'Deploys', colorVar: '--chart-bar-3' }
  ];

  protected readonly normalizedData = computed(() => {
    const d = this.data();
    const max = Math.max(
      ...d.flatMap(item => [item.commits, item.prs * 5, item.deploys * 10])
    );

    return d.map(item => ({
      ...item,
      commitsHeight: (item.commits / max) * 100,
      prsHeight: (item.prs * 5 / max) * 100,
      deploysHeight: (item.deploys * 10 / max) * 100
    }));
  });
}
