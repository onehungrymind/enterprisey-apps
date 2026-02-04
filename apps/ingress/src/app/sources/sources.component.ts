import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataSource } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';
import { SourcesFacade } from '@proto/ingress-state';
import { filter, Observable } from 'rxjs';

import { SourceListComponent } from './source-list/source-list.component';
import { SourceDetailComponent } from './source-detail/source-detail.component';
import { SourceStatusComponent } from './source-status/source-status.component';
import { SchemaViewerComponent } from './schema-viewer/schema-viewer.component';

@Component({
  selector: 'proto-sources',
  imports: [
    CommonModule,
    MaterialModule,
    SourceListComponent,
    SourceDetailComponent,
    SourceStatusComponent,
    SchemaViewerComponent,
  ],
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss'],
})
export class SourcesComponent implements OnInit {
  sources$ = this.sourcesFacade.allSources$;
  selectedSource$: Observable<DataSource> = this.sourcesFacade.selectedSource$.pipe(
    filter((source): source is DataSource => source !== undefined && source !== false)
  );
  currentSchema$ = this.sourcesFacade.currentSchema$;
  sourcesByStatus$ = this.sourcesFacade.sourcesByStatus$;

  constructor(private sourcesFacade: SourcesFacade) {}

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.loadSources();
    this.sourcesFacade.resetSelectedSource();
  }

  selectSource(source: DataSource) {
    this.sourcesFacade.selectSource(source.id as string);
    this.sourcesFacade.loadSchema(source.id as string);
  }

  loadSources() {
    this.sourcesFacade.loadSources();
  }

  saveSource(source: DataSource) {
    this.sourcesFacade.saveSource(source);
  }

  deleteSource(source: DataSource) {
    this.sourcesFacade.deleteSource(source);
  }

  testConnection(sourceId: string) {
    this.sourcesFacade.testConnection(sourceId);
  }

  syncSource(sourceId: string) {
    this.sourcesFacade.syncSource(sourceId);
  }
}
