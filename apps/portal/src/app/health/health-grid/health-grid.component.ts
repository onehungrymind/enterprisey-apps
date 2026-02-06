import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthCellComponent } from '../health-cell/health-cell.component';
import { HealthStatus } from '@proto/api-interfaces';

interface GridFeature {
  slug: string;
  name: string;
  webApp: { status: HealthStatus; responseTimeMs: number } | null;
  api: { status: HealthStatus; responseTimeMs: number } | null;
  database: { status: HealthStatus; responseTimeMs: number; message?: string } | null;
}

@Component({
  selector: 'proto-health-grid',
  standalone: true,
  imports: [CommonModule, HealthCellComponent],
  templateUrl: './health-grid.component.html',
  styleUrls: ['./health-grid.component.scss'],
})
export class HealthGridComponent {
  @Input() features: GridFeature[] = [];

  readonly layers = ['Web App', 'API', 'Database'] as const;
}
