import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { StepType } from '@proto/api-interfaces';
// ActionButtonComponent available from '@proto/ui-theme' if needed

export interface InspectorStep {
  id: string;
  type: StepType | 'source' | 'output';
  name: string;
  config: string;
  records: number;
}

interface StepTypeConfig {
  icon: string;
  label: string;
  colorVar: string;
}

const STEP_TYPES: Record<string, StepTypeConfig> = {
  source: { icon: '&#9673;', label: 'Source', colorVar: '--node-source' },
  filter: { icon: '&#8856;', label: 'Filter', colorVar: '--node-filter' },
  map: { icon: '&#8674;', label: 'Map', colorVar: '--node-map' },
  aggregate: { icon: '&#931;', label: 'Aggregate', colorVar: '--node-agg' },
  join: { icon: '&#8904;', label: 'Join', colorVar: '--node-join' },
  sort: { icon: '&#8597;', label: 'Sort', colorVar: '--node-sort' },
  deduplicate: { icon: '&#8860;', label: 'Dedupe', colorVar: '--node-dedup' },
  output: { icon: '&#9678;', label: 'Output', colorVar: '--node-output' },
};

// Toolbar step types (excluding source and output)
const TOOLBAR_STEP_TYPES = [
  { key: 'filter', ...STEP_TYPES['filter'] },
  { key: 'map', ...STEP_TYPES['map'] },
  { key: 'aggregate', ...STEP_TYPES['aggregate'] },
  { key: 'join', ...STEP_TYPES['join'] },
  { key: 'sort', ...STEP_TYPES['sort'] },
  { key: 'deduplicate', ...STEP_TYPES['deduplicate'] },
];

@Component({
  selector: 'proto-step-inspector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <aside class="inspector">
      <div class="section-title">Step Inspector</div>

      @if (step(); as s) {
        @let typeConfig = getTypeConfig(s.type);
        <div class="step-detail fade-slide">
          <!-- Step Header -->
          <div class="step-header">
            <div
              class="step-icon"
              [style.color]="'var(' + typeConfig.colorVar + ')'"
              [innerHTML]="typeConfig.icon"
            ></div>
            <div class="step-info">
              <div class="step-name">{{ s.name }}</div>
              <div
                class="step-type"
                [style.color]="'var(' + typeConfig.colorVar + ')'"
              >
                {{ typeConfig.label }} Step
              </div>
            </div>
          </div>

          <!-- Configuration -->
          <div class="config-section">
            <div class="config-label">Configuration</div>
            <div class="config-code">{{ s.config }}</div>
          </div>

          <!-- Metrics -->
          <div class="metrics-grid">
            <div class="metric-box">
              <div class="metric-label">Input Records</div>
              <div class="metric-value">{{ formatRecords(s.records) }}</div>
            </div>
            <div class="metric-box">
              <div class="metric-label">Avg Duration</div>
              <div class="metric-value">{{ getDuration(s.type) }}</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="action-buttons">
            <button type="button" class="action-btn accent">Edit Step</button>
            <button type="button" class="action-btn secondary">Preview Data</button>
          </div>
        </div>
      } @else {
        <div class="empty-inspector">
          Click a node to<br />inspect configuration
        </div>
      }

      <!-- Add Step Toolbar -->
      <div class="add-step-section">
        <div class="section-title">Add Step</div>
        <div class="step-toolbar">
          @for (stepType of toolbarStepTypes; track stepType.key) {
            <button
              type="button"
              class="toolbar-btn"
              [title]="stepType.label"
            >
              <span
                class="toolbar-icon"
                [style.color]="'var(' + stepType.colorVar + ')'"
                [innerHTML]="stepType.icon"
              ></span>
              <span class="toolbar-label">{{ stepType.label }}</span>
            </button>
          }
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }

    .inspector {
      width: 260px;
      border-left: 1px solid var(--border-default);
      padding: 16px 14px;
      flex-shrink: 0;
      overflow: auto;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-root);
    }

    .section-title {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 14px;
    }

    .empty-inspector {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120px;
      color: var(--text-ghost);
      font-size: 12px;
      text-align: center;
      line-height: 1.6;
    }

    .fade-slide {
      animation: fadeSlide 0.25s ease;
    }

    @keyframes fadeSlide {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    // Step Header
    .step-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }

    .step-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--bg-surface-hover);
      border: 1px solid var(--border-default);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      flex-shrink: 0;
    }

    .step-info {
      flex: 1;
      min-width: 0;
    }

    .step-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .step-type {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      opacity: 0.8;
    }

    // Configuration
    .config-section {
      margin-bottom: 16px;
    }

    .config-label {
      font-size: 9px;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 6px;
      font-weight: 600;
    }

    .config-code {
      background: var(--bg-code);
      border-radius: 8px;
      border: 1px solid var(--border-default);
      padding: 10px 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      color: var(--text-secondary);
      line-height: 1.7;
      white-space: pre-wrap;
    }

    // Metrics
    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }

    .metric-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      padding: 8px 10px;
    }

    .metric-label {
      font-size: 8px;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 3px;
    }

    .metric-value {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-secondary);
      font-family: 'JetBrains Mono', monospace;
    }

    // Actions
    .action-buttons {
      display: flex;
      gap: 6px;
    }

    .action-btn {
      flex: 1;
      padding: 7px 0;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.15s;

      &.accent {
        background: var(--accent-subtle);
        border: 1px solid var(--border-default);
        color: var(--accent);
      }

      &.secondary {
        background: var(--bg-surface-hover);
        border: 1px solid var(--border-default);
        color: var(--text-tertiary);
      }

      &:hover {
        filter: brightness(1.1);
      }
    }

    // Add Step Section
    .add-step-section {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border-subtle);
    }

    .step-toolbar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

    .toolbar-btn {
      padding: 8px 10px;
      border-radius: 8px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.15s;
      font-family: 'DM Sans', sans-serif;

      &:hover {
        background: var(--bg-surface-hover);
        border-color: var(--border-strong);
      }
    }

    .toolbar-icon {
      font-size: 13px;
    }

    .toolbar-label {
      font-size: 10px;
      color: var(--text-tertiary);
      font-weight: 500;
    }
  `]
})
export class StepInspectorComponent {
  readonly step = input<InspectorStep | null>(null);

  protected readonly toolbarStepTypes = TOOLBAR_STEP_TYPES;

  protected getTypeConfig(type: string): StepTypeConfig {
    return STEP_TYPES[type] || STEP_TYPES['filter'];
  }

  protected formatRecords(count: number): string {
    if (count >= 1_000_000) {
      return (count / 1_000_000).toFixed(1) + 'M';
    }
    if (count >= 1_000) {
      return (count / 1_000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  protected getDuration(type: string): string {
    if (type === 'source') {
      return '---';
    }
    // Random duration for demo
    const ms = Math.round(Math.random() * 800 + 100);
    return `${ms}ms`;
  }
}
