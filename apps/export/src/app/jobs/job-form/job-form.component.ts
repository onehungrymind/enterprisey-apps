import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExportJob } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-job-form',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './job-form.component.html',
})
export class JobFormComponent {
  @Output() submitted = new EventEmitter<ExportJob>();

  name = '';
  queryId = '';
  format = 'csv';
  formats = ['csv', 'json', 'xlsx', 'pdf'];

  submit() {
    this.submitted.emit({
      name: this.name,
      queryId: this.queryId,
      format: this.format as any,
      status: 'queued',
      progress: 0,
      scheduleCron: null,
      outputUrl: null,
      createdBy: 'current-user',
      startedAt: null,
      completedAt: null,
      fileSize: null,
      recordCount: null,
      error: null,
    } as ExportJob);
    this.name = '';
    this.queryId = '';
  }
}
