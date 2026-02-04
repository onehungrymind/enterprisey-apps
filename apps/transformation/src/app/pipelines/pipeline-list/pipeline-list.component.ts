import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pipeline } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-pipeline-list',
  imports: [CommonModule, MaterialModule],
  templateUrl: './pipeline-list.component.html',
})
export class PipelineListComponent {
  @Input() pipelines: Pipeline[] = [];
  @Input() statusCounts: Record<string, number> = {};
  @Output() selected = new EventEmitter<Pipeline>();
  @Output() deleted = new EventEmitter<Pipeline>();
  @Output() runPipeline = new EventEmitter<string>();

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'draft': return 'accent';
      case 'paused': return 'warn';
      case 'error': return 'warn';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active': return 'play_circle';
      case 'draft': return 'edit_note';
      case 'paused': return 'pause_circle';
      case 'error': return 'error';
      default: return 'help';
    }
  }
}
