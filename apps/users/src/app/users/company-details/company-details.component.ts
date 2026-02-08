import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { ActionButtonComponent } from '@proto/ui-theme';
import { Company, User } from '@proto/api-interfaces';

@Component({
  selector: 'proto-company-details',
  standalone: true,
  imports: [ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (company(); as c) {
      <div class="details-content">
        <div class="company-header">
          <div class="company-icon">
            <span class="icon-letter">{{ c.name.charAt(0).toUpperCase() }}</span>
          </div>
          <h2 class="company-name">{{ c.name }}</h2>
          <p class="company-description">{{ c.description }}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Users</span>
            <span class="stat-value">{{ companyUsers().length }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">ID</span>
            <span class="stat-value id-value">{{ c.id?.slice(0, 8) }}...</span>
          </div>
        </div>

        @if (companyUsers().length > 0) {
          <div class="users-section">
            <h3 class="section-title">Team Members</h3>
            <div class="users-list">
              @for (user of companyUsers().slice(0, 5); track user.id) {
                <div class="user-item">
                  <div class="user-avatar" [style.background]="getAvatarColor(user)">
                    {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
                    <span class="user-role">{{ user.role }}</span>
                  </div>
                </div>
              }
              @if (companyUsers().length > 5) {
                <div class="more-users">+{{ companyUsers().length - 5 }} more</div>
              }
            </div>
          </div>
        }

        <div class="actions">
          <ui-action-button variant="primary" (clicked)="edit.emit(c)">
            <span class="btn-icon">✎</span> Edit
          </ui-action-button>
          <ui-action-button
            variant="danger"
            [disabled]="companyUsers().length > 0"
            (clicked)="delete.emit(c)"
          >
            <span class="btn-icon btn-icon-delete">🗑</span> Delete
          </ui-action-button>
        </div>

        @if (companyUsers().length > 0) {
          <p class="delete-warning">Cannot delete company with assigned users</p>
        }
      </div>
    } @else {
      <div class="empty-state">Select a company</div>
    }
  `,
  styles: [`
    .details-content {
      padding: 20px;
    }

    .company-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .company-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: var(--accent-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
    }

    .icon-letter {
      font-size: 24px;
      font-weight: 600;
      color: var(--accent);
    }

    .company-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 4px 0;
    }

    .company-description {
      font-size: 13px;
      color: var(--text-secondary);
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--bg-inset);
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }

    .stat-value {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .stat-value.id-value {
      font-size: 12px;
      font-family: monospace;
    }

    .users-section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 12px 0;
    }

    .users-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .user-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      background: var(--bg-inset);
      border-radius: 6px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: white;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 11px;
      color: var(--text-tertiary);
      text-transform: capitalize;
    }

    .more-users {
      font-size: 12px;
      color: var(--text-tertiary);
      text-align: center;
      padding: 8px;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border-default);
    }

    .btn-icon {
      margin-right: 4px;
    }

    .btn-icon-delete {
      filter: grayscale(100%) brightness(0);
    }

    .delete-warning {
      font-size: 11px;
      color: var(--text-tertiary);
      text-align: center;
      margin: 8px 0 0 0;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: var(--text-tertiary);
      font-size: 14px;
    }
  `]
})
export class CompanyDetailsComponent {
  readonly company = input<Company | null>(null);
  readonly users = input<User[]>([]);
  readonly edit = output<Company>();
  readonly delete = output<Company>();

  private readonly avatarColors = ['#60a5fa', '#34d399', '#fbbf24', '#c084fc', '#f472b6', '#fb923c'];

  protected readonly companyUsers = computed(() => {
    const c = this.company();
    if (!c) return [];
    return this.users().filter(u => u.company_id === c.id);
  });

  protected getAvatarColor(user: User): string {
    const index = (user.firstName.charCodeAt(0) + user.lastName.charCodeAt(0)) % this.avatarColors.length;
    return this.avatarColors[index];
  }
}
