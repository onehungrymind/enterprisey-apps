import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataSource } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-source-status',
  imports: [CommonModule, MaterialModule],
  templateUrl: './source-status.component.html',
  styleUrls: ['./source-status.component.scss'],
})
export class SourceStatusComponent {
  @Input() source!: DataSource;
  @Output() testConnection = new EventEmitter<string>();
  @Output() syncSource = new EventEmitter<string>();

  get isProcessing(): boolean {
    return this.source?.status === 'syncing' || this.source?.status === 'testing';
  }
}
