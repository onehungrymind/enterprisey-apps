import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { SparklineComponent } from '@proto/ui-charts';

@Component({
  selector: 'ui-metric-card',
  standalone: true,
  imports: [SparklineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="metric-card">
      <div class="label">{{ label() }}</div>
      <div class="value-row">
        <div class="value-content">
          <span class="value">{{ value() }}</span>
          @if (change()) {
            <span class="change" [class.positive]="positive()" [class.negative]="!positive()">
              {{ change() }}
            </span>
          }
        </div>
        @if (sparkline().length > 0) {
          <ui-sparkline
            [data]="sparkline()"
            [color]="sparklineColor()"
            [lineWidth]="1.5"
          />
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .metric-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: var(--shadow-sm);
      transition: all 0.2s;
    }
    .metric-card:hover { border-color: var(--border-strong); transform: translateY(-1px); }
    .label { font-size: 9px; color: var(--text-quaternary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; font-weight: 600; }
    .value-row { display: flex; align-items: flex-end; gap: 12px; }
    .value-content { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
    .value { font-size: 22px; font-weight: 700; color: var(--text-primary); font-family: 'JetBrains Mono', monospace; line-height: 1; }
    .change { font-size: 10px; font-weight: 600; }
    .change.positive { color: var(--color-success); }
    .change.negative { color: var(--color-danger); }
    ui-sparkline { flex: 1; height: 30px; min-width: 0; }
  `]
})
export class MetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly change = input<string>();
  readonly positive = input(true);
  readonly sparkline = input<number[]>([]);

  protected readonly sparklineColor = computed(() =>
    this.positive() ? 'var(--color-success, #10b981)' : 'var(--color-danger, #ef4444)'
  );
}
