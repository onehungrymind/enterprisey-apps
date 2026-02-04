import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PipelineRun } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-run-history',
  imports: [CommonModule, MaterialModule, DatePipe],
  templateUrl: './run-history.component.html',
})
export class RunHistoryComponent {
  @Input() runs: PipelineRun[] = [];

  displayedColumns = ['status', 'startedAt', 'completedAt', 'recordsProcessed'];

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'primary';
      case 'running': return 'accent';
      case 'failed': return 'warn';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return 'check_circle';
      case 'running': return 'hourglass_empty';
      case 'failed': return 'error';
      default: return 'help';
    }
  }
}
