import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Dashboard, Widget } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-dashboard-viewer',
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard-viewer.component.html',
})
export class DashboardViewerComponent {
  @Input() dashboard!: Dashboard;

  getWidgetIcon(type: string): string {
    switch (type) {
      case 'table': return 'table_chart';
      case 'bar_chart': return 'bar_chart';
      case 'line_chart': return 'show_chart';
      case 'pie_chart': return 'pie_chart';
      case 'metric': return 'speed';
      case 'text': return 'text_snippet';
      default: return 'widgets';
    }
  }
}
