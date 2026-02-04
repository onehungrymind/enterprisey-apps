import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DataSchema } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-schema-viewer',
  imports: [CommonModule, MaterialModule],
  templateUrl: './schema-viewer.component.html',
  styleUrls: ['./schema-viewer.component.scss'],
})
export class SchemaViewerComponent {
  @Input() schema!: DataSchema;

  getTypeIcon(type: string): string {
    switch (type) {
      case 'string': return 'text_fields';
      case 'number': return 'tag';
      case 'boolean': return 'toggle_on';
      case 'date': return 'calendar_today';
      case 'object': return 'data_object';
      case 'array': return 'data_array';
      default: return 'help';
    }
  }
}
