import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ProgressBarComponent } from '@proto/ui-theme';

export interface CustomerData {
  name: string;
  arr: number;
  health: number;
  growth: number;
}

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [ProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-container">
      <div class="table-header">
        <span>Customer</span>
        <span>ARR</span>
        <span>Health</span>
        <span class="text-right">Growth</span>
      </div>

      @for (customer of customers(); track customer.name; let i = $index) {
        <div class="table-row" [style.animation-delay.s]="i * 0.04">
          <span class="customer-name">{{ customer.name }}</span>
          <span class="arr mono">\${{ formatArr(customer.arr) }}K</span>
          <div class="health-cell">
            <ui-progress-bar
              [progress]="customer.health"
              [status]="getHealthStatus(customer.health)"
            />
            <span
              class="health-value mono"
              [class.success]="customer.health >= 90"
              [class.warning]="customer.health >= 70 && customer.health < 90"
              [class.danger]="customer.health < 70"
            >
              {{ customer.health }}
            </span>
          </div>
          <span
            class="growth mono text-right"
            [class.positive]="customer.growth >= 0"
            [class.negative]="customer.growth < 0"
          >
            {{ customer.growth >= 0 ? '+' : '' }}{{ customer.growth }}%
          </span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .table-container {
      display: flex;
      flex-direction: column;
    }

    .table-header {
      display: grid;
      grid-template-columns: 1fr 90px 90px 80px;
      padding: 6px 0;
      font-size: 9px;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 4px;
    }

    .table-row {
      display: grid;
      grid-template-columns: 1fr 90px 90px 80px;
      padding: 7px 0;
      align-items: center;
      border-bottom: 1px solid var(--border-subtle);
      animation: fadeUp 0.3s ease both;
    }

    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .customer-name {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .arr {
      font-size: 11px;
      color: var(--text-tertiary);
    }

    .health-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      ui-progress-bar {
        flex: 1;
      }
    }

    .health-value {
      font-size: 10px;
      font-weight: 600;
      min-width: 28px;
      text-align: right;
    }

    .health-value.success {
      color: var(--color-success);
    }

    .health-value.warning {
      color: var(--color-warning);
    }

    .health-value.danger {
      color: var(--color-danger);
    }

    .growth {
      font-size: 10px;
      font-weight: 600;
    }

    .growth.positive {
      color: var(--color-success);
    }

    .growth.negative {
      color: var(--color-danger);
    }

    .text-right {
      text-align: right;
    }

    .mono {
      font-family: 'JetBrains Mono', monospace;
    }
  `]
})
export class CustomerTableComponent {
  readonly customers = input.required<CustomerData[]>();

  protected formatArr(arr: number): string {
    return (arr / 1000).toFixed(0);
  }

  protected getHealthStatus(health: number): 'healthy' | 'warning' | 'error' {
    if (health >= 90) return 'healthy';
    if (health >= 70) return 'warning';
    return 'error';
  }
}
