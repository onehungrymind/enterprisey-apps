import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService, ThemeToggleComponent, AvatarComponent, FilterChipComponent, ActionButtonComponent, ConfirmDialogComponent } from '@proto/ui-theme';
import { User, UserRoleEnum, Company } from '@proto/api-interfaces';
import { UsersFacade } from '@proto/users-state';
import { toSignal } from '@angular/core/rxjs-interop';

import { UsersListComponent } from './users-list/users-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { RolesTabComponent } from './roles-tab/roles-tab.component';
import { AuditTabComponent } from './audit-tab/audit-tab.component';
import { UserFormComponent } from './user-form/user-form.component';

export type TabId = 'users' | 'roles' | 'audit';

export interface RoleConfig {
  key: UserRoleEnum;
  label: string;
  icon: string;
  colorVar: string;
  bgVar: string;
  permissions: string[];
}

export const ROLE_CONFIGS: RoleConfig[] = [
  {
    key: UserRoleEnum.ADMIN,
    label: 'Admin',
    icon: '\u2B21',
    colorVar: '--role-admin',
    bgVar: '--role-admin-bg',
    permissions: ['Full access', 'User management', 'System config', 'All features']
  },
  {
    key: UserRoleEnum.MENTOR,
    label: 'Mentor',
    icon: '\u25C8',
    colorVar: '--role-mentor',
    bgVar: '--role-mentor-bg',
    permissions: ['Create pipelines', 'Edit dashboards', 'Export data', 'View users']
  },
  {
    key: UserRoleEnum.APPRENTICE,
    label: 'Apprentice',
    icon: '\u25C7',
    colorVar: '--role-apprentice',
    bgVar: '--role-apprentice-bg',
    permissions: ['View dashboards', 'Run exports', 'View pipelines']
  },
  {
    key: UserRoleEnum.USER,
    label: 'User',
    icon: '\u25CB',
    colorVar: '--role-user',
    bgVar: '--role-user-bg',
    permissions: ['View dashboards', 'Download exports']
  }
];

export interface AuditLogEntry {
  time: string;
  user: string;
  action: string;
  type: 'edit' | 'export' | 'create' | 'invite' | 'permission' | 'auth';
}

export const AUDIT_LOG: AuditLogEntry[] = [
  { time: '14:32', user: 'Sarah Chen', action: "Updated pipeline 'Customer 360'", type: 'edit' },
  { time: '14:28', user: 'Lukas Mathis', action: "Exported 'Customer Segments' as CSV", type: 'export' },
  { time: '14:15', user: 'Raj Patel', action: "Created dashboard 'Q1 Review'", type: 'create' },
  { time: '13:58', user: 'Emily Zhao', action: 'Invited marcus.j@globex.io', type: 'invite' },
  { time: '13:45', user: 'James Kim', action: 'Modified role for Ana Rivera → User', type: 'permission' },
  { time: '13:22', user: 'Sarah Chen', action: "Connected data source 'Snowflake'", type: 'create' },
  { time: '12:50', user: 'David Okonkwo', action: "Disabled export job 'Monthly Report'", type: 'edit' },
  { time: '12:30', user: 'Lukas Mathis', action: 'Logged in from 192.168.1.42', type: 'auth' },
];

// Extended user data for the UI (simulating additional fields not in DB)
export interface ExtendedUser extends User {
  status: 'active' | 'inactive' | 'invited';
  lastLogin: string;
  sessions: number;
  avatarColor: string;
  companyName: string;
}

@Component({
  selector: 'proto-users',
  standalone: true,
  imports: [
    ThemeToggleComponent,
    AvatarComponent,
    FilterChipComponent,
    ActionButtonComponent,
    UsersListComponent,
    UserDetailsComponent,
    RolesTabComponent,
    AuditTabComponent,
    UserFormComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {
  private readonly usersFacade = inject(UsersFacade);
  protected readonly themeService = inject(ThemeService);

  // Tab state
  protected readonly activeTab = signal<TabId>('users');
  protected readonly tabs: { id: TabId; label: string }[] = [
    { id: 'users', label: 'Users' },
    { id: 'roles', label: 'Roles' },
    { id: 'audit', label: 'Audit' }
  ];

  // Filter state
  protected readonly filterRole = signal<UserRoleEnum | 'all'>('all');
  protected readonly filterCompany = signal<string>('all');
  protected readonly searchQuery = signal('');

  // Selected user
  protected readonly selectedUserId = signal<string | null>(null);

  // Users from facade
  private readonly rawUsers = toSignal(this.usersFacade.allUsers$, { initialValue: [] as User[] });

  // Companies from facade
  protected readonly allCompanies = toSignal(this.usersFacade.allCompanies$, { initialValue: [] as Company[] });

  // Extended users with additional UI data
  protected readonly users = computed<ExtendedUser[]>(() => {
    const avatarColors = ['#60a5fa', '#34d399', '#fbbf24', '#c084fc', '#f472b6', '#fb923c', '#818cf8', '#f87171', '#94a3b8'];
    const statuses: ('active' | 'inactive' | 'invited')[] = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active', 'inactive', 'invited', 'active'];
    const lastLogins = ['2 min ago', '14 min ago', '1 hour ago', '3 hours ago', '30 min ago', '2 hours ago', '45 min ago', '5 hours ago', '1 day ago', '2 weeks ago', 'Never', '20 min ago'];
    const sessions = [847, 1203, 524, 312, 678, 189, 456, 87, 234, 42, 0, 156];
    const companiesMap = new Map(this.allCompanies().map(c => [c.id, c.name]));

    return this.rawUsers().map((user, index) => ({
      ...user,
      status: statuses[index % statuses.length],
      lastLogin: lastLogins[index % lastLogins.length],
      sessions: sessions[index % sessions.length],
      avatarColor: avatarColors[index % avatarColors.length],
      companyName: companiesMap.get(user.company_id) || 'Unknown'
    }));
  });

  // Filtered users
  protected readonly filteredUsers = computed(() => {
    const role = this.filterRole();
    const company = this.filterCompany();
    const search = this.searchQuery().toLowerCase();

    return this.users().filter(user => {
      const matchesRole = role === 'all' || user.role === role;
      const matchesCompany = company === 'all' || user.companyName === company;
      const matchesSearch = search === '' ||
        `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search);
      return matchesRole && matchesCompany && matchesSearch;
    });
  });

  // Selected user details
  protected readonly selectedUser = computed(() => {
    const id = this.selectedUserId();
    if (!id) return null;
    return this.users().find(u => u.id === id) ?? null;
  });

  // Form modal state
  protected readonly showUserForm = signal(false);
  protected readonly editingUser = signal<User | null>(null);

  // Delete confirmation dialog state
  protected readonly showDeleteConfirm = signal(false);
  protected readonly deletingUser = signal<User | null>(null);

  // Companies for filter
  protected readonly companies = computed(() => {
    const companySet = new Set(this.users().map(u => u.companyName));
    return Array.from(companySet);
  });

  // Stats
  protected readonly stats = computed(() => [
    { label: 'Total', value: this.users().length, colorVar: '--text-secondary' },
    { label: 'Active', value: this.users().filter(u => u.status === 'active').length, colorVar: '--color-success' },
    { label: 'Admins', value: this.users().filter(u => u.role === UserRoleEnum.ADMIN).length, colorVar: '--color-danger' },
    { label: 'Companies', value: this.companies().length, colorVar: '--color-info' }
  ]);

  // Role configs for filters
  protected readonly roleFilters = computed(() => [
    { key: 'all' as const, label: 'All' },
    ...ROLE_CONFIGS.map(r => ({ key: r.key, label: `${r.icon} ${r.label}` }))
  ]);

  // Audit log
  protected readonly auditLog = AUDIT_LOG;

  // Role configs
  protected readonly roleConfigs = ROLE_CONFIGS;

  constructor() {
    this.usersFacade.loadUsers();
    this.usersFacade.loadCompanies();
  }

  protected setActiveTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  protected setFilterRole(role: UserRoleEnum | 'all'): void {
    this.filterRole.set(role);
  }

  protected setFilterCompany(company: string): void {
    this.filterCompany.set(company);
  }

  protected setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  protected selectUser(userId: string): void {
    this.selectedUserId.set(userId);
  }

  protected getRoleConfig(role: UserRoleEnum): RoleConfig {
    return ROLE_CONFIGS.find(r => r.key === role) ?? ROLE_CONFIGS[3];
  }

  protected getUserCountByRole(role: UserRoleEnum): number {
    return this.users().filter(u => u.role === role).length;
  }

  // Form modal handlers
  protected openInviteForm(): void {
    this.editingUser.set(null);
    this.showUserForm.set(true);
  }

  protected openEditForm(user: User): void {
    this.editingUser.set(user);
    this.showUserForm.set(true);
  }

  protected closeForm(): void {
    this.showUserForm.set(false);
    this.editingUser.set(null);
  }

  protected saveUser(user: User): void {
    this.usersFacade.saveUser(user);
    this.closeForm();
  }

  protected deleteUser(user: User): void {
    this.deletingUser.set(user);
    this.showDeleteConfirm.set(true);
  }

  protected confirmDelete(): void {
    const user = this.deletingUser();
    if (user) {
      this.usersFacade.deleteUser(user);
      this.selectedUserId.set(null);
    }
    this.cancelDelete();
  }

  protected cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deletingUser.set(null);
  }
}
