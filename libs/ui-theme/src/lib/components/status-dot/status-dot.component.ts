import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type StatusType = 'healthy' | 'success' | 'connected' | 'active' | 'completed'
  | 'degraded' | 'warning' | 'syncing' | 'running' | 'processing'
  | 'unhealthy' | 'error' | 'danger' | 'failed'
  | 'unknown' | 'disconnected' | 'paused' | 'draft' | 'inactive';

interface StatusConfig {
  color: string;
  label: string;
  pulse: boolean;
}

const STATUS_CONFIGS: Record<StatusType, StatusConfig> = {
  // Success states
  healthy: { color: 'var(--color-success)', label: 'Healthy', pulse: false },
  success: { color: 'var(--color-success)', label: 'Success', pulse: false },
  connected: { color: 'var(--color-success)', label: 'Connected', pulse: false },
  active: { color: 'var(--color-success)', label: 'Active', pulse: false },
  completed: { color: 'var(--color-success)', label: 'Completed', pulse: false },

  // Warning states
  degraded: { color: 'var(--color-warning)', label: 'Degraded', pulse: true },
  warning: { color: 'var(--color-warning)', label: 'Warning', pulse: false },
  syncing: { color: 'var(--color-warning)', label: 'Syncing', pulse: true },
  running: { color: 'var(--color-warning)', label: 'Running', pulse: true },
  processing: { color: 'var(--color-warning)', label: 'Processing', pulse: true },

  // Error states
  unhealthy: { color: 'var(--color-danger)', label: 'Unhealthy', pulse: true },
  error: { color: 'var(--color-danger)', label: 'Error', pulse: true },
  danger: { color: 'var(--color-danger)', label: 'Danger', pulse: false },
  failed: { color: 'var(--color-danger)', label: 'Failed', pulse: false },

  // Neutral states
  unknown: { color: 'var(--text-quaternary)', label: 'Unknown', pulse: false },
  disconnected: { color: 'var(--text-quaternary)', label: 'Disconnected', pulse: false },
  paused: { color: 'var(--color-info)', label: 'Paused', pulse: false },
  draft: { color: 'var(--text-quaternary)', label: 'Draft', pulse: false },
  inactive: { color: 'var(--text-quaternary)', label: 'Inactive', pulse: false },
};

@Component({
  selector: 'ui-status-dot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="status-container">
      <span
        class="dot"
        [style.background-color]="config().color"
      ></span>
      @if (config().pulse) {
        <span
          class="pulse-ring"
          [style.border-color]="config().color"
        ></span>
      }
      @if (showLabel()) {
        <span class="label" [style.color]="config().color">
          {{ config().label }}
        </span>
      }
    </span>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .status-container {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }

    .pulse-ring {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1.5px solid;
      animation: pulseRing 2s ease-out infinite;
    }

    .label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    @keyframes pulseRing {
      0% {
        transform: translateY(-50%) scale(1);
        opacity: 0.8;
      }
      100% {
        transform: translateY(-50%) scale(2.2);
        opacity: 0;
      }
    }
  `]
})
export class StatusDotComponent {
  readonly status = input.required<StatusType>();
  readonly showLabel = input(false);
  readonly customLabel = input<string>();

  protected readonly config = computed(() => {
    const cfg = STATUS_CONFIGS[this.status()] || STATUS_CONFIGS.unknown;
    if (this.customLabel()) {
      return { ...cfg, label: this.customLabel()! };
    }
    return cfg;
  });
}
