import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TransformStep } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-step-list',
  imports: [CommonModule, MaterialModule, DragDropModule],
  templateUrl: './step-list.component.html',
})
export class StepListComponent {
  @Input() steps: TransformStep[] = [];
  @Output() editStep = new EventEmitter<TransformStep>();
  @Output() deleteStep = new EventEmitter<TransformStep>();
  @Output() reorderStep = new EventEmitter<{ stepId: string; newOrder: number }>();

  getStepIcon(type: string): string {
    switch (type) {
      case 'filter': return 'filter_list';
      case 'map': return 'transform';
      case 'aggregate': return 'functions';
      case 'join': return 'merge';
      case 'sort': return 'sort';
      case 'deduplicate': return 'content_copy';
      default: return 'settings';
    }
  }

  drop(event: CdkDragDrop<TransformStep[]>) {
    if (event.previousIndex !== event.currentIndex) {
      const step = this.steps[event.previousIndex];
      this.reorderStep.emit({
        stepId: step.id as string,
        newOrder: event.currentIndex + 1,
      });
    }
  }
}
