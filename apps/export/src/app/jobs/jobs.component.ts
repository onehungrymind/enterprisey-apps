import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { ExportJob, ExportFormat, JobStatus } from '@proto/api-interfaces';
import { ExportJobsStore } from '@proto/export-state';
import {
  ThemeService,
  ThemeToggleComponent,
  FilterChipComponent,
  ActionButtonComponent,
} from '@proto/ui-theme';

import { JobCardComponent } from '../components/job-card/job-card.component';
import { JobDetailComponent } from '../components/job-detail/job-detail.component';
import { FormatStatsComponent } from '../components/format-stats/format-stats.component';
import { RecentActivityComponent } from '../components/recent-activity/recent-activity.component';
import { ScheduleViewComponent } from '../components/schedule-view/schedule-view.component';

type ViewMode = 'jobs' | 'schedule';
type StatusFilter = 'all' | JobStatus;
type FormatFilter = 'all' | ExportFormat;

interface SummaryMetric {
  label: string;
  value: string | number;
  color: string;
}

@Component({
  selector: 'proto-jobs',
  standalone: true,
  imports: [
    ThemeToggleComponent,
    FilterChipComponent,
    ActionButtonComponent,
    JobCardComponent,
    JobDetailComponent,
    FormatStatsComponent,
    RecentActivityComponent,
    ScheduleViewComponent,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent implements OnInit, OnDestroy {
  protected readonly store = inject(ExportJobsStore);
  protected readonly themeService = inject(ThemeService);

  private pollInterval?: ReturnType<typeof setInterval>;

  // UI State
  protected readonly selectedJobId = signal<string | null>(null);
  protected readonly filterStatus = signal<StatusFilter>('all');
  protected readonly filterFormat = signal<FormatFilter>('all');
  protected readonly viewMode = signal<ViewMode>('jobs');

  // Filter options
  protected readonly statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: '\u2713 Done' },
    { key: 'processing', label: '\u25ce Active' },
    { key: 'failed', label: '\u2717 Failed' },
  ];

  protected readonly formatFilters: { key: ExportFormat; label: string; cssVar: string }[] = [
    { key: 'csv', label: 'CSV', cssVar: '--fmt-csv' },
    { key: 'json', label: 'JSON', cssVar: '--fmt-json' },
    { key: 'xlsx', label: 'XLSX', cssVar: '--fmt-xlsx' },
    { key: 'pdf', label: 'PDF', cssVar: '--fmt-pdf' },
  ];

  // Computed values
  protected readonly allJobs = computed(() => this.store.entities());

  protected readonly filteredJobs = computed(() => {
    const jobs = this.allJobs();
    const status = this.filterStatus();
    const format = this.filterFormat();

    return jobs.filter(job => {
      const matchesStatus = status === 'all' || job.status === status;
      const matchesFormat = format === 'all' || job.format === format;
      return matchesStatus && matchesFormat;
    });
  });

  protected readonly selectedJob = computed(() => {
    const id = this.selectedJobId();
    if (!id) return null;
    return this.allJobs().find(j => j.id === id) || null;
  });

  protected readonly summaryMetrics = computed((): SummaryMetric[] => {
    const jobs = this.allJobs();
    const completed = jobs.filter(j => j.status === 'completed').length;
    const active = jobs.filter(j => j.status === 'processing' || j.status === 'queued').length;
    const totalSize = jobs
      .filter(j => j.fileSize)
      .reduce((sum, j) => sum + (j.fileSize || 0), 0);

    return [
      { label: 'Done', value: completed, color: 'var(--color-success)' },
      { label: 'Active', value: active, color: 'var(--accent)' },
      { label: 'Size', value: this.formatFileSize(totalSize), color: 'var(--text-secondary)' },
    ];
  });

  ngOnInit() {
    this.startPolling();
    // Select first active job if available
    const active = this.store.activeJobs();
    if (active.length > 0 && active[0].id) {
      this.selectedJobId.set(active[0].id);
    }
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  protected selectJob(jobId: string) {
    this.selectedJobId.set(jobId);
  }

  protected setStatusFilter(status: StatusFilter) {
    this.filterStatus.set(status);
  }

  protected toggleFormatFilter(format: ExportFormat) {
    if (this.filterFormat() === format) {
      this.filterFormat.set('all');
    } else {
      this.filterFormat.set(format);
    }
  }

  protected setViewMode(mode: ViewMode) {
    this.viewMode.set(mode);
  }

  protected onNewExport() {
    // Open new export dialog/form
    console.log('New export clicked');
  }

  protected onDownload() {
    const job = this.selectedJob();
    if (job?.outputUrl) {
      window.open(job.outputUrl, '_blank');
    }
  }

  protected onRetry() {
    const job = this.selectedJob();
    if (job) {
      this.store.startExport(job);
    }
  }

  protected onConfigure() {
    console.log('Configure clicked');
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
      this.pollInterval = undefined;
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
