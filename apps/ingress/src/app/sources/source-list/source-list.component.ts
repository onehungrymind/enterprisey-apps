import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataSource } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'proto-source-list',
  imports: [MaterialModule, CommonModule],
  templateUrl: './source-list.component.html',
  styleUrls: ['./source-list.component.scss'],
})
export class SourceListComponent {
  @Input() sources: DataSource[] = [];
  @Input() statusCounts: Record<string, number> = {};
  @Output() selected = new EventEmitter<DataSource>();
  @Output() deleted = new EventEmitter<DataSource>();
  @Output() testConnection = new EventEmitter<string>();
  @Output() syncSource = new EventEmitter<string>();

  getStatusColor(status: string): string {
    switch (status) {
      case 'connected': return 'primary';
      case 'error': return 'warn';
      case 'syncing':
      case 'testing': return 'accent';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'connected': return 'check_circle';
      case 'disconnected': return 'cancel';
      case 'error': return 'error';
      case 'syncing': return 'sync';
      case 'testing': return 'hourglass_empty';
      default: return 'help';
    }
  }
}
