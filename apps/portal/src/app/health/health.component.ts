import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HealthGridComponent } from './health-grid/health-grid.component';
import { HealthStore } from '@proto/health-state';

@Component({
  selector: 'proto-health',
  standalone: true,
  imports: [CommonModule, HealthGridComponent],
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss'],
})
export class HealthComponent implements OnInit, OnDestroy {
  private readonly healthStore = inject(HealthStore);
  private readonly platformId = inject(PLATFORM_ID);

  readonly healthGrid = this.healthStore.healthGrid;
  readonly overallStatus = this.healthStore.overallStatus;
  readonly loading = this.healthStore.loading;
  readonly lastChecked = this.healthStore.lastChecked;
  readonly healthyCount = this.healthStore.healthyCount;
  readonly totalCount = this.healthStore.totalCount;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.healthStore.startPolling(10000);
    }
  }

  ngOnDestroy() {
    this.healthStore.stopPolling();
  }

  refresh() {
    if (isPlatformBrowser(this.platformId)) {
      this.healthStore.refreshNow();
    }
  }

  get statusClass(): string {
    return this.overallStatus();
  }

  get statusLabel(): string {
    switch (this.overallStatus()) {
      case 'healthy': return 'All Systems Operational';
      case 'degraded': return 'Partial System Degradation';
      case 'unhealthy': return 'System Outage Detected';
      default: return 'Checking Status...';
    }
  }

  formatLastChecked(): string {
    const checked = this.lastChecked();
    if (!checked) return 'Never';
    const date = new Date(checked);
    return date.toLocaleTimeString();
  }
}
