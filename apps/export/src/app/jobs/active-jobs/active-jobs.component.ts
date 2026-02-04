import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExportJob } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-active-jobs',
  imports: [CommonModule, MaterialModule],
  templateUrl: './active-jobs.component.html',
})
export class ActiveJobsComponent {
  @Input() jobs: ExportJob[] = [];
  @Output() cancelJob = new EventEmitter<string>();
}
