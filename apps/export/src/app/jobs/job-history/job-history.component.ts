import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExportJob } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-job-history',
  imports: [CommonModule, MaterialModule, DatePipe],
  templateUrl: './job-history.component.html',
})
export class JobHistoryComponent {
  @Input() jobs: ExportJob[] = [];
  @Input() failedJobs: ExportJob[] = [];
  @Output() removeJob = new EventEmitter<ExportJob>();

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return 'check_circle';
      case 'failed': return 'error';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'primary';
      case 'failed': return 'warn';
      case 'cancelled': return 'accent';
      default: return '';
    }
  }

  formatSize(bytes: number | null): string {
    if (!bytes) return '--';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
}
