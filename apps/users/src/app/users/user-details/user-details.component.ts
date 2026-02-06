import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { AvatarComponent, ActionButtonComponent } from '@proto/ui-theme';
import { UserRoleEnum } from '@proto/api-interfaces';
import { ExtendedUser, ROLE_CONFIGS } from '../users.component';

@Component({
  selector: 'proto-user-details',
  standalone: true,
  imports: [AvatarComponent, ActionButtonComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent {
  readonly user = input<ExtendedUser | null>(null);

  protected readonly roleConfig = computed(() => {
    const u = this.user();
    if (!u) return null;
    return ROLE_CONFIGS.find(r => r.key === u.role) ?? ROLE_CONFIGS[3];
  });

  protected readonly statusConfig = computed(() => {
    const u = this.user();
    if (!u) return null;

    const configs: Record<string, { label: string; colorVar: string }> = {
      active: { label: 'Active', colorVar: '--status-active' },
      inactive: { label: 'Inactive', colorVar: '--status-inactive' },
      invited: { label: 'Invited', colorVar: '--status-invited' }
    };

    return configs[u.status] ?? configs['inactive'];
  });

  protected readonly detailStats = computed(() => {
    const u = this.user();
    const role = this.roleConfig();
    if (!u || !role) return [];

    return [
      { label: 'Sessions', value: u.sessions.toLocaleString() },
      { label: 'Company', value: u.companyName.split(' ')[0] },
      { label: 'Last Login', value: u.lastLogin },
      { label: 'Role', value: role.label }
    ];
  });
}
