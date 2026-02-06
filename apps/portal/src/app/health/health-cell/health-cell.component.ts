import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthStatus } from '@proto/api-interfaces';

@Component({
  selector: 'proto-health-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-cell.component.html',
  styleUrls: ['./health-cell.component.scss'],
})
export class HealthCellComponent {
  @Input() status: HealthStatus | null = null;
  @Input() responseTimeMs: number | null = null;
  @Input() message?: string;
  @Input() label = '';

  get statusClass(): string {
    if (!this.status) return 'unknown';
    return this.status;
  }

  get statusIcon(): string {
    switch (this.status) {
      case 'healthy': return '●';
      case 'degraded': return '●';
      case 'unhealthy': return '●';
      default: return '○';
    }
  }

  get tooltipText(): string {
    const parts: string[] = [];
    if (this.label) parts.push(this.label);
    if (this.status) parts.push(`Status: ${this.status}`);
    if (this.responseTimeMs !== null) parts.push(`Response: ${this.responseTimeMs}ms`);
    if (this.message) parts.push(`Message: ${this.message}`);
    return parts.join('\n');
  }
}
