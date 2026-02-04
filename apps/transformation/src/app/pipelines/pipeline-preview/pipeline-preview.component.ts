import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SchemaField } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-pipeline-preview',
  imports: [CommonModule, MaterialModule],
  templateUrl: './pipeline-preview.component.html',
})
export class PipelinePreviewComponent {
  @Input() preview: SchemaField[] = [];

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
