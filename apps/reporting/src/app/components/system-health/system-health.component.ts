import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { StatusDotComponent, StatusType } from '@proto/ui-theme';

export interface SystemHealthData {
  label: string;
  status: 'Healthy' | 'Degraded' | 'Unhealthy';
  uptime: string;
}

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [StatusDotComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="health-container">
      @for (system of systems(); track system.label) {
        <div class="health-row">
          <div class="system-info">
            <ui-status-dot [status]="getStatusType(system.status)" />
            <span class="system-label">{{ system.label }}</span>
          </div>
          <span class="uptime mono">{{ system.uptime }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .health-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .health-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid var(--border-subtle);
    }

    .system-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .system-label {
      font-size: 11px;
      color: var(--text-secondary);
    }

    .uptime {
      font-size: 10px;
      color: var(--text-quaternary);
    }

    .mono {
      font-family: 'JetBrains Mono', monospace;
    }
  `]
})
export class SystemHealthComponent {
  readonly systems = input.required<SystemHealthData[]>();

  protected getStatusType(status: string): StatusType {
    switch (status) {
      case 'Healthy': return 'healthy';
      case 'Degraded': return 'degraded';
      case 'Unhealthy': return 'unhealthy';
      default: return 'unknown';
    }
  }
}
