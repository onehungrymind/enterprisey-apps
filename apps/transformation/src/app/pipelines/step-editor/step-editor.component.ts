import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransformStep } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-step-editor',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './step-editor.component.html',
})
export class StepEditorComponent implements OnChanges {
  @Input() step!: TransformStep;
  @Output() saved = new EventEmitter<TransformStep>();
  @Output() cancelled = new EventEmitter<void>();

  currentStep!: TransformStep;
  stepTypes = ['filter', 'map', 'aggregate', 'join', 'sort', 'deduplicate'];
  configJson = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['step']) {
      this.currentStep = { ...this.step };
      this.configJson = JSON.stringify(this.currentStep.config || {}, null, 2);
    }
  }

  save() {
    try {
      this.currentStep.config = JSON.parse(this.configJson);
    } catch {
      // keep existing config
    }
    this.saved.emit(this.currentStep);
  }

  cancel() {
    this.cancelled.emit();
  }
}
