import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'ui-metric-card',
  standalone: true,
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
          <svg class="sparkline" viewBox="0 0 60 24">
            <polyline
              [attr.points]="sparklinePoints()"
              fill="none"
              [attr.stroke]="positive() ? 'var(--color-success)' : 'var(--color-danger)'"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity="0.6"
            />
          </svg>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .metric-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: var(--shadow-sm);
      transition: all 0.2s;
    }

    .metric-card:hover {
      border-color: var(--border-strong);
      transform: translateY(-1px);
    }

    .label {
      font-size: 9px;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .value-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .value-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .value {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
      font-family: 'JetBrains Mono', monospace;
      line-height: 1;
    }

    .change {
      font-size: 10px;
      font-weight: 600;
      display: inline-block;
    }

    .change.positive {
      color: var(--color-success);
    }

    .change.negative {
      color: var(--color-danger);
    }

    .sparkline {
      width: 60px;
      height: 24px;
      overflow: visible;
    }
  `]
})
export class MetricCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly change = input<string>();
  readonly positive = input(true);
  readonly sparkline = input<number[]>([]);

  protected sparklinePoints(): string {
    const data = this.sparkline();
    if (data.length === 0) return '';

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return data
      .map((v, i) => `${(i / (data.length - 1)) * 60},${24 - ((v - min) / range) * 20 - 2}`)
      .join(' ');
  }
}
