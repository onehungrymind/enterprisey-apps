import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Pipeline, TransformStep, PipelineRun, StepType } from '@proto/api-interfaces';
import { PipelinesFacade } from '@proto/transformation-state';
import {
  ThemeService,
  ThemeToggleComponent,
  PageHeaderComponent,
  ActionButtonComponent,
  StatusDotComponent,
  StatusType,
} from '@proto/ui-theme';

import { PipelineSidebarComponent } from './pipeline-sidebar/pipeline-sidebar.component';
import { PipelineCanvasComponent, CanvasStep, CanvasEdge } from './pipeline-canvas/pipeline-canvas.component';
import { RunHistoryPanelComponent } from './run-history-panel/run-history-panel.component';
import { UpperCasePipe } from '@angular/common';

export interface PipelineWithStats extends Pipeline {
  runsToday: number;
  successRate: number;
  recordsProcessed: number;
}

@Component({
  selector: 'proto-pipelines',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ThemeToggleComponent,
    PageHeaderComponent,
    ActionButtonComponent,
    StatusDotComponent,
    PipelineSidebarComponent,
    PipelineCanvasComponent,
    RunHistoryPanelComponent,
    UpperCasePipe,
  ],
  templateUrl: './pipelines.component.html',
  styleUrl: './pipelines.component.scss',
})
export class PipelinesComponent implements OnInit {
  private readonly pipelinesFacade = inject(PipelinesFacade);
  protected readonly themeService = inject(ThemeService);

  // State
  protected readonly selectedPipelineId = signal<string | null>(null);
  protected readonly selectedStepId = signal<string | null>(null);
  protected readonly showRunHistory = signal(false);
  protected readonly searchQuery = signal('');

  // Data from facade
  private readonly apiPipelines = toSignal(this.pipelinesFacade.allPipelines$, { initialValue: [] });
  private readonly apiRuns = toSignal(this.pipelinesFacade.recentRuns$, { initialValue: [] });
  private readonly selectedApiPipeline = toSignal(this.pipelinesFacade.selectedPipeline$);

  // Filter and enhance pipelines with computed stats
  protected readonly pipelines = computed<PipelineWithStats[]>(() => {
    const query = this.searchQuery().toLowerCase();
    const runs = this.apiRuns();

    return this.apiPipelines()
      .filter(p => !query || p.name.toLowerCase().includes(query))
      .map(p => {
        // Calculate stats from runs
        const pipelineRuns = runs.filter(r => r.pipelineId === p.id);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayRuns = pipelineRuns.filter(r => new Date(r.startedAt) >= todayStart);
        const completedRuns = pipelineRuns.filter(r => r.status === 'completed');
        const successRate = pipelineRuns.length > 0
          ? (completedRuns.length / pipelineRuns.length) * 100
          : 0;
        const recordsProcessed = pipelineRuns.reduce((sum, r) => sum + r.recordsProcessed, 0);

        return {
          ...p,
          runsToday: todayRuns.length,
          successRate: Math.round(successRate * 100) / 100,
          recordsProcessed,
        };
      });
  });

  protected readonly currentPipeline = computed(() => {
    const id = this.selectedPipelineId();
    if (!id) return this.pipelines()[0] || null;
    return this.pipelines().find(p => p.id === id) || null;
  });

  // Canvas steps come from pipeline.steps relationship
  protected readonly currentSteps = computed<CanvasStep[]>(() => {
    const pipeline = this.currentPipeline();
    if (!pipeline?.steps?.length) return [];

    return [...pipeline.steps]
      .sort((a, b) => a.order - b.order)
      .map((step, index) => this.mapToCanvasStep(step, index));
  });

  // Generate edges from step order (sequential by default)
  protected readonly currentEdges = computed<CanvasEdge[]>(() => {
    const steps = this.currentSteps();
    if (steps.length < 2) return [];

    const edges: CanvasEdge[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      edges.push([steps[i].id, steps[i + 1].id]);
    }
    return edges;
  });

  protected readonly selectedStep = computed(() => {
    const stepId = this.selectedStepId();
    if (!stepId) return null;
    return this.currentSteps().find(s => s.id === stepId) || null;
  });

  protected readonly runHistory = computed(() => {
    const pipelineId = this.selectedPipelineId();
    if (!pipelineId) return this.apiRuns();
    return this.apiRuns().filter(r => r.pipelineId === pipelineId);
  });

  ngOnInit(): void {
    this.pipelinesFacade.loadPipelines();
  }

  private mapToCanvasStep(step: TransformStep, index: number): CanvasStep {
    const spacing = 220;
    const startX = 60;
    const baseY = 160;

    return {
      id: step.id || `step-${index}`,
      type: step.type as CanvasStep['type'],
      name: step.config['name'] || `${step.type} step`,
      config: step.config['expression'] || step.config['condition'] || JSON.stringify(step.config),
      records: step.outputSchema?.length || 0,
      x: startX + index * spacing,
      y: baseY + (index % 2 === 0 ? 0 : -60),
    };
  }

  protected selectPipeline(pipeline: Pipeline): void {
    this.selectedPipelineId.set(pipeline.id || '');
    this.selectedStepId.set(null);
    this.showRunHistory.set(false);
    // Select pipeline in store and load its runs
    if (pipeline.id) {
      this.pipelinesFacade.selectPipeline(pipeline.id);
      this.pipelinesFacade.loadRuns(pipeline.id);
    }
  }

  protected runPipeline(): void {
    const pipelineId = this.selectedPipelineId();
    if (pipelineId) {
      this.pipelinesFacade.runPipeline(pipelineId);
    }
  }

  protected selectStep(stepId: string): void {
    this.selectedStepId.set(stepId);
  }

  protected toggleRunHistory(): void {
    this.showRunHistory.update(v => !v);
  }

  protected onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  protected createNewPipeline(): void {
    // Would open a modal or navigate to creation form
    console.log('Create new pipeline');
  }

  protected getStatusType(status: string): StatusType {
    switch (status) {
      case 'active': return 'active';
      case 'draft': return 'draft';
      case 'paused': return 'paused';
      case 'error': return 'error';
      default: return 'unknown';
    }
  }

  protected getStepIcon(type: string): string {
    const icons: Record<string, string> = {
      source: '●',
      filter: '⊘',
      map: '→',
      aggregate: 'Σ',
      join: '⋈',
      sort: '↕',
      deduplicate: '⊜',
      output: '◎',
    };
    return icons[type] || '○';
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
}
