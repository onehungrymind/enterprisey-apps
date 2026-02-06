import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RoleConfig } from '../users.component';
import { UserRoleEnum } from '@proto/api-interfaces';

@Component({
  selector: 'proto-roles-tab',
  standalone: true,
  imports: [],
  templateUrl: './roles-tab.component.html',
  styleUrl: './roles-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesTabComponent {
  readonly roleConfigs = input.required<RoleConfig[]>();
  readonly getUserCount = input.required<(role: UserRoleEnum) => number>();
}
