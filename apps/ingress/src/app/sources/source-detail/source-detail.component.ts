import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataSource, DataSourceType } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-source-detail',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './source-detail.component.html',
  styleUrls: ['./source-detail.component.scss'],
})
export class SourceDetailComponent {
  currentSource!: DataSource;
  originalName = '';

  sourceTypes: DataSourceType[] = ['database', 'rest_api', 'csv_file', 'webhook'];
  syncOptions = ['manual', 'realtime', '*/15 * * * *', '0 * * * *', '0 0 * * *'];

  @Input() set source(value: DataSource | null) {
    if (value) this.originalName = value.name;
    this.currentSource = Object.assign({}, value);
    if (!this.currentSource.connectionConfig) {
      this.currentSource.connectionConfig = {};
    }
    if (!this.currentSource.errorLog) {
      this.currentSource.errorLog = [];
    }
  }

  @Output() saved = new EventEmitter<DataSource>();
  @Output() cancelled = new EventEmitter();

  getConnectionConfigKeys(): string[] {
    return Object.keys(this.currentSource.connectionConfig || {});
  }

  addConfigField() {
    const key = `field_${Object.keys(this.currentSource.connectionConfig).length}`;
    this.currentSource.connectionConfig[key] = '';
  }
}
