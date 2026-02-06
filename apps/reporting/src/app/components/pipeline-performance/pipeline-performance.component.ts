import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ProgressBarComponent } from '@proto/ui-theme';

export interface PipelineData {
  name: string;
  success: number;
  runs: number;
}

@Component({
  selector: 'app-pipeline-performance',
  standalone: true,
  imports: [ProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pipeline-container">
      @for (pipeline of pipelines(); track pipeline.name) {
        <div class="pipeline-row">
          <span class="pipeline-name">{{ pipeline.name }}</span>
          <div class="progress-wrapper">
            <ui-progress-bar
              [progress]="pipeline.success"
              [status]="getStatus(pipeline.success)"
            />
          </div>
          <span class="success-rate mono">{{ pipeline.success }}%</span>
          <span class="runs mono">{{ pipeline.runs }} runs</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .pipeline-container {
      display: flex;
      flex-direction: column;
    }

    .pipeline-row {
      display: grid;
      grid-template-columns: 140px 1fr 60px 70px;
      padding: 8px 0;
      align-items: center;
      border-bottom: 1px solid var(--border-subtle);
    }

    .pipeline-name {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .progress-wrapper {
      padding-right: 12px;
    }

    .success-rate {
      font-size: 10px;
      color: var(--text-tertiary);
      text-align: right;
    }

    .runs {
      font-size: 10px;
      color: var(--text-quaternary);
      text-align: right;
    }

    .mono {
      font-family: 'JetBrains Mono', monospace;
    }
  `]
})
export class PipelinePerformanceComponent {
  readonly pipelines = input.required<PipelineData[]>();

  protected getStatus(success: number): 'healthy' | 'warning' | 'error' | 'inactive' {
    if (success >= 99) return 'healthy';
    if (success >= 80) return 'warning';
    if (success > 0) return 'error';
    return 'inactive';
  }
}
