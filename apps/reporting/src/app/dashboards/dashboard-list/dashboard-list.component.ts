import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dashboard } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-dashboard-list',
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard-list.component.html',
})
export class DashboardListComponent {
  @Input() dashboards: Dashboard[] = [];
  @Input() loading = false;
  @Output() selected = new EventEmitter<Dashboard>();
  @Output() deleted = new EventEmitter<Dashboard>();
}
