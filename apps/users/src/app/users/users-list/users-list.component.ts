import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { AvatarComponent } from '@proto/ui-theme';
import { UserRoleEnum } from '@proto/api-interfaces';
import { ExtendedUser, ROLE_CONFIGS } from '../users.component';

interface StatusConfig {
  label: string;
  colorVar: string;
}

const STATUS_CONFIGS: Record<string, StatusConfig> = {
  active: { label: 'Active', colorVar: '--status-active' },
  inactive: { label: 'Inactive', colorVar: '--status-inactive' },
  invited: { label: 'Invited', colorVar: '--status-invited' }
};

@Component({
  selector: 'proto-users-list',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {
  readonly users = input.required<ExtendedUser[]>();
  readonly selectedUserId = input<string | null>(null);
  readonly userSelected = output<string>();

  protected getRoleConfig(role: UserRoleEnum) {
    return ROLE_CONFIGS.find(r => r.key === role) ?? ROLE_CONFIGS[3];
  }

  protected getStatusConfig(status: string): StatusConfig {
    return STATUS_CONFIGS[status] ?? STATUS_CONFIGS['inactive'];
  }

  protected selectUser(userId: string | null | undefined): void {
    if (userId) {
      this.userSelected.emit(userId);
    }
  }
}
