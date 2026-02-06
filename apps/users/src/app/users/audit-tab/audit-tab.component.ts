import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { AuditLogEntry } from '../users.component';

@Component({
  selector: 'proto-audit-tab',
  standalone: true,
  imports: [],
  templateUrl: './audit-tab.component.html',
  styleUrl: './audit-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditTabComponent {
  readonly auditLog = input.required<AuditLogEntry[]>();

  protected getActionColorVar(type: string): string {
    const colors: Record<string, string> = {
      edit: '--action-edit',
      export: '--action-export',
      create: '--action-create',
      invite: '--action-invite',
      permission: '--action-permission',
      auth: '--action-auth'
    };
    return colors[type] ?? '--text-quaternary';
  }
}
