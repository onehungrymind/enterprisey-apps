import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  ElementRef,
  viewChild,
  AfterViewInit,
} from '@angular/core';
import { StepType } from '@proto/api-interfaces';

export interface CanvasStep {
  id: string;
  type: StepType | 'source' | 'output';
  name: string;
  config: string;
  records: number;
  x: number;
  y: number;
}

export type CanvasEdge = [string, string];

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

const NODE_WIDTH = 180;
const NODE_HEIGHT = 72;

@Component({
  selector: 'proto-pipeline-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #canvasContainer
      class="canvas-container"
      [class.dragging]="isDragging()"
      (mousedown)="onCanvasMouseDown($event)"
      (mousemove)="onCanvasMouseMove($event)"
      (mouseup)="onCanvasMouseUp()"
      (mouseleave)="onCanvasMouseUp()"
      data-testid="canvas-container"
    >
      <!-- Grid Background -->
      <div
        class="grid-bg"
        [style.background-position]="gridPosition()"
      ></div>

      <!-- SVG for Edges -->
      <svg class="edges-layer" data-testid="edges-layer">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="var(--edge-color)" />
          </marker>
        </defs>

        @for (edge of edgePaths(); track edge.id; let i = $index) {
          <g [attr.data-testid]="'edge-' + edge.id">
            <path
              [attr.d]="edge.path"
              fill="none"
              stroke="var(--edge-color)"
              stroke-width="2"
              marker-end="url(#arrowhead)"
            />
            <circle r="3" fill="var(--particle-color)" opacity="0.6">
              <animateMotion
                [attr.dur]="(2 + i * 0.3) + 's'"
                repeatCount="indefinite"
                [attr.path]="edge.path"
              />
            </circle>
          </g>
        }
      </svg>

      <!-- Nodes -->
      @for (step of steps(); track step.id) {
        @let typeConfig = getTypeConfig(step.type);
        @let isSelected = step.id === selectedStepId();
        <div
          class="node-card"
          [class.selected]="isSelected"
          [style.left.px]="step.x + offset().x"
          [style.top.px]="step.y + offset().y"
          (click)="onNodeClick($event, step.id)"
          [attr.data-testid]="'node-' + step.id"
          [attr.data-node-type]="step.type"
          [attr.data-node-name]="step.name"
        >
          <!-- Input Port -->
          @if (step.type !== 'source') {
            <div class="port port-input" data-testid="port-input"></div>
          }

          <!-- Output Port -->
          @if (step.type !== 'output') {
            <div class="port port-output" data-testid="port-output"></div>
          }

          <!-- Node Content -->
          <div class="node-header">
            <div
              class="node-icon"
              [style.color]="'var(' + typeConfig.colorVar + ')'"
              [innerHTML]="typeConfig.icon"
              data-testid="node-icon"
            ></div>
            <div class="node-info">
              <div class="node-name" data-testid="node-name">{{ step.name }}</div>
              <div
                class="node-type"
                [style.color]="'var(' + typeConfig.colorVar + ')'"
                data-testid="node-type"
              >
                {{ typeConfig.label }}
              </div>
            </div>
          </div>
          <div class="node-footer">
            <span class="record-count" data-testid="node-record-count">{{ formatRecords(step.records) }} rec</span>
            <span class="arrow">&#8594;</span>
          </div>
        </div>
      }

      <!-- Zoom Controls -->
      <div class="zoom-controls" data-testid="zoom-controls">
        <button type="button" class="zoom-btn" title="Zoom Out" data-testid="zoom-out-btn">&#8854;</button>
        <button type="button" class="zoom-btn" title="Zoom In" data-testid="zoom-in-btn">&#8853;</button>
        <button
          type="button"
          class="zoom-btn"
          title="Reset View"
          (click)="resetView()"
          data-testid="zoom-reset-btn"
        >&#8982;</button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      flex: 1;
      overflow: hidden;
    }

    .canvas-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      cursor: grab;

      &.dragging {
        cursor: grabbing;
      }
    }

    .grid-bg {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 50% 50%, var(--accent-subtle) 0%, transparent 70%),
        linear-gradient(var(--grid-line) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
      background-size: 100% 100%, 24px 24px, 24px 24px;
      transition: background 0.4s;
      pointer-events: none;
    }

    .edges-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .node-card {
      position: absolute;
      width: 180px;
      background: var(--node-bg);
      border: 1.5px solid var(--border-default);
      border-radius: 12px;
      padding: 10px 12px;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
      backdrop-filter: blur(12px);
      box-shadow: var(--shadow-sm);
      z-index: 1;

      &:hover {
        border-color: var(--accent);
        box-shadow: var(--shadow-md);
      }

      &.selected {
        border-color: var(--accent);
        box-shadow: var(--shadow-md);
        z-index: 10;
      }
    }

    .port {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--bg-root);
      border: 2px solid var(--border-default);
      z-index: 2;
      top: 50%;
      transform: translateY(-50%);
    }

    .port-input {
      left: -5px;
    }

    .port-output {
      right: -5px;
    }

    .node-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }

    .node-icon {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      background: var(--bg-surface-hover);
      border: 1px solid var(--border-default);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .node-info {
      flex: 1;
      min-width: 0;
    }

    .node-name {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .node-type {
      font-size: 9px;
      font-weight: 500;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .node-footer {
      font-size: 10px;
      color: var(--text-quaternary);
      font-family: 'JetBrains Mono', monospace;
      display: flex;
      justify-content: space-between;
    }

    .arrow {
      color: var(--text-ghost);
    }

    .zoom-controls {
      position: absolute;
      bottom: 16px;
      right: 16px;
      display: flex;
      gap: 4px;
    }

    .zoom-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      color: var(--text-tertiary);
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;

      &:hover {
        border-color: var(--border-strong);
        color: var(--text-secondary);
      }
    }
  `]
})
export class PipelineCanvasComponent implements AfterViewInit {
  readonly steps = input.required<CanvasStep[]>();
  readonly edges = input.required<CanvasEdge[]>();
  readonly selectedStepId = input<string | null>(null);
  readonly stepSelected = output<string>();

  private readonly canvasContainer = viewChild<ElementRef<HTMLDivElement>>('canvasContainer');

  protected readonly offset = signal({ x: 0, y: 0 });
  protected readonly isDragging = signal(false);
  private dragStart = { x: 0, y: 0 };

  protected readonly gridPosition = computed(() => {
    const o = this.offset();
    return `0 0, ${o.x % 24}px ${o.y % 24}px, ${o.x % 24}px ${o.y % 24}px`;
  });

  protected readonly stepsById = computed(() => {
    const map = new Map<string, CanvasStep>();
    for (const step of this.steps()) {
      map.set(step.id, step);
    }
    return map;
  });

  protected readonly edgePaths = computed(() => {
    const stepsMap = this.stepsById();
    const o = this.offset();

    return this.edges().map(([fromId, toId], index) => {
      const from = stepsMap.get(fromId);
      const to = stepsMap.get(toId);

      if (!from || !to) {
        return { id: `edge-${index}`, path: '' };
      }

      const x1 = from.x + NODE_WIDTH + o.x;
      const y1 = from.y + NODE_HEIGHT / 2 + o.y;
      const x2 = to.x + o.x;
      const y2 = to.y + NODE_HEIGHT / 2 + o.y;
      const dx = x2 - x1;

      const path = `M ${x1} ${y1} C ${x1 + dx * 0.4} ${y1}, ${x2 - dx * 0.4} ${y2}, ${x2} ${y2}`;

      return { id: `edge-${index}`, path };
    });
  });

  ngAfterViewInit(): void {
    // Could initialize any canvas-specific setup here
  }

  protected getTypeConfig(type: string): StepTypeConfig {
    return STEP_TYPES[type] || STEP_TYPES['filter'];
  }

  protected formatRecords(count: number): string {
    if (count >= 1_000_000) {
      return (count / 1_000_000).toFixed(1) + 'M';
    }
    if (count >= 1_000) {
      return Math.round(count / 1_000) + 'K';
    }
    return count.toString();
  }

  protected onCanvasMouseDown(event: MouseEvent): void {
    // Don't start drag if clicking on a node
    if ((event.target as HTMLElement).closest('.node-card')) {
      return;
    }

    this.isDragging.set(true);
    this.dragStart = {
      x: event.clientX - this.offset().x,
      y: event.clientY - this.offset().y,
    };
  }

  protected onCanvasMouseMove(event: MouseEvent): void {
    if (!this.isDragging()) return;

    this.offset.set({
      x: event.clientX - this.dragStart.x,
      y: event.clientY - this.dragStart.y,
    });
  }

  protected onCanvasMouseUp(): void {
    this.isDragging.set(false);
  }

  protected onNodeClick(event: MouseEvent, stepId: string): void {
    event.stopPropagation();
    this.stepSelected.emit(stepId);
  }

  protected resetView(): void {
    this.offset.set({ x: 0, y: 0 });
  }
}
