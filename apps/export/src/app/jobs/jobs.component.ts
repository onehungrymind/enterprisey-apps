import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ExportJob } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';
import { ExportJobsStore } from '@proto/export-state';

import { JobFormComponent } from './job-form/job-form.component';
import { ActiveJobsComponent } from './active-jobs/active-jobs.component';
import { JobHistoryComponent } from './job-history/job-history.component';

@Component({
  selector: 'proto-jobs',
  imports: [
    CommonModule,
    MaterialModule,
    JobFormComponent,
    ActiveJobsComponent,
    JobHistoryComponent,
  ],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit, OnDestroy {
  readonly store = inject(ExportJobsStore);
  private pollInterval: any;

  ngOnInit() {
    this.startPolling();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  startExport(job: ExportJob) {
    this.store.startExport(job);
    this.startPolling();
  }

  cancelJob(jobId: string) {
    this.store.cancelJob(jobId);
  }

  removeJob(job: ExportJob) {
    this.store.removeJob(job);
  }

  private startPolling() {
    if (this.pollInterval) return;
    this.pollInterval = setInterval(() => {
      if (this.store.hasActiveJobs()) {
        this.store.pollActiveJobs();
      }
    }, 2000);
  }

  private stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }
}
