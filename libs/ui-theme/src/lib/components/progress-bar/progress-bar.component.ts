import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { StatusType } from '../status-dot/status-dot.component';

const STATUS_COLORS: Record<string, string> = {
  healthy: 'var(--color-success)',
  success: 'var(--color-success)',
  completed: 'var(--color-success)',
  active: 'var(--color-success)',
  processing: 'var(--accent)',
  syncing: 'var(--accent)',
  running: 'var(--accent)',
  warning: 'var(--color-warning)',
  degraded: 'var(--color-warning)',
  queued: 'var(--color-info)',
  info: 'var(--color-info)',
  error: 'var(--color-danger)',
  failed: 'var(--color-danger)',
  unhealthy: 'var(--color-danger)',
};

@Component({
  selector: 'ui-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="track">
      <div
        class="fill"
        [style.width.%]="progress()"
        [style.background]="barColor()"
      ></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .track {
      height: 3px;
      background: var(--border-subtle);
      border-radius: 2px;
      overflow: hidden;
    }

    .fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.6s ease;
    }
  `]
})
export class ProgressBarComponent {
  readonly progress = input(0);
  readonly status = input<StatusType | string>('active');
  readonly color = input<string | undefined>();

  protected readonly barColor = computed(() => {
    if (this.color()) {
      return this.color();
    }
    return STATUS_COLORS[this.status()] || 'var(--accent)';
  });
}
