import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pipeline } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

const EMPTY_PIPELINE: Pipeline = {
  name: '',
  description: '',
  sourceId: '',
  steps: [],
  status: 'draft',
  lastRunAt: null,
  createdBy: '',
};

@Component({
  selector: 'proto-pipeline-editor',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './pipeline-editor.component.html',
})
export class PipelineEditorComponent implements OnChanges {
  @Input() pipeline: Pipeline | null = null;
  @Output() saved = new EventEmitter<Pipeline>();
  @Output() cancelled = new EventEmitter<void>();

  currentPipeline: Pipeline = { ...EMPTY_PIPELINE };
  statuses = ['draft', 'active', 'paused'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pipeline']) {
      this.currentPipeline = this.pipeline ? { ...this.pipeline } : { ...EMPTY_PIPELINE };
    }
  }

  save() {
    this.saved.emit(this.currentPipeline);
  }

  cancel() {
    this.cancelled.emit();
  }
}
