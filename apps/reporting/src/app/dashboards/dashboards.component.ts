import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Dashboard } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';
import { DashboardsStore } from '@proto/reporting-state';

import { DashboardListComponent } from './dashboard-list/dashboard-list.component';
import { DashboardViewerComponent } from './dashboard-viewer/dashboard-viewer.component';

@Component({
  selector: 'proto-dashboards',
  imports: [
    CommonModule,
    MaterialModule,
    DashboardListComponent,
    DashboardViewerComponent,
  ],
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
})
export class DashboardsComponent {
  readonly store = inject(DashboardsStore);

  selectDashboard(dashboard: Dashboard) {
    this.store.select(dashboard.id!);
  }

  deleteDashboard(dashboard: Dashboard) {
    this.store.remove(dashboard);
  }

  saveDashboard(dashboard: Dashboard) {
    if (dashboard.id) {
      this.store.update(dashboard);
    } else {
      this.store.create(dashboard);
    }
  }

  reset() {
    this.store.resetSelection();
  }
}
