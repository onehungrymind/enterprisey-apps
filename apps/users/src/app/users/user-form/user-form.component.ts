import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '@proto/ui-theme';
import { User, UserRoleEnum, Company } from '@proto/api-interfaces';
import { ROLE_CONFIGS } from '../users.component';

@Component({
  selector: 'proto-user-form',
  standalone: true,
  imports: [FormsModule, ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditMode() ? 'Edit User' : 'Invite User' }}</h2>
          <button class="close-btn" (click)="onCancel()">&times;</button>
        </div>

        <form class="modal-body" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="firstName"
                name="firstName"
                required
                placeholder="Enter first name"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="lastName"
                name="lastName"
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-input"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="user@company.com"
            />
          </div>

          @if (!isEditMode()) {
            <div class="form-group">
              <label class="form-label">Password</label>
              <input
                type="password"
                class="form-input"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="Enter password"
              />
            </div>
          }

          <div class="form-group">
            <label class="form-label">Role</label>
            <div class="role-options">
              @for (role of roles; track role.key) {
                <label
                  class="role-option"
                  [class.selected]="selectedRole === role.key"
                >
                  <input
                    type="radio"
                    name="role"
                    [value]="role.key"
                    [(ngModel)]="selectedRole"
                  />
                  <span class="role-icon" [style.color]="'var(' + role.colorVar + ')'">
                    {{ role.icon }}
                  </span>
                  <span class="role-label">{{ role.label }}</span>
                </label>
              }
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Company</label>
            <select
              class="form-input"
              [(ngModel)]="companyId"
              name="companyId"
              required
            >
              <option value="" disabled>Select a company</option>
              @for (company of companies(); track company.id) {
                <option [value]="company.id">{{ company.name }}</option>
              }
            </select>
          </div>

          <div class="modal-actions">
            <ui-action-button variant="secondary" (clicked)="onCancel()">
              Cancel
            </ui-action-button>
            <ui-action-button variant="primary" (clicked)="onSubmit()">
              {{ isEditMode() ? 'Save Changes' : 'Send Invite' }}
            </ui-action-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.15s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.2s ease;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-default);
    }

    .modal-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.15s;
    }

    .close-btn:hover {
      background: var(--bg-surface-hover);
      color: var(--text-primary);
    }

    .modal-body {
      padding: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .form-input {
      width: 100%;
      padding: 10px 12px;
      background: var(--bg-inset);
      border: 1px solid var(--border-default);
      border-radius: 6px;
      font-size: 13px;
      color: var(--text-primary);
      transition: all 0.15s;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-subtle);
    }

    .form-input::placeholder {
      color: var(--text-quaternary);
    }

    .role-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .role-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: var(--bg-inset);
      border: 1px solid var(--border-default);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .role-option:hover {
      border-color: var(--border-strong);
    }

    .role-option.selected {
      border-color: var(--accent);
      background: var(--accent-subtle);
    }

    .role-option input[type="radio"] {
      display: none;
    }

    .role-icon {
      font-size: 14px;
    }

    .role-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border-default);
    }
  `]
})
export class UserFormComponent {
  readonly user = input<User | null>(null);
  readonly companies = input<Company[]>([]);
  readonly save = output<User>();
  readonly cancel = output<void>();

  protected readonly roles = ROLE_CONFIGS;

  // Form fields
  protected firstName = '';
  protected lastName = '';
  protected email = '';
  protected password = '';
  protected selectedRole: UserRoleEnum = UserRoleEnum.USER;
  protected companyId = '';

  protected readonly isEditMode = computed(() => !!this.user()?.id);

  constructor() {
    // Populate form when user input changes
    effect(() => {
      const u = this.user();
      if (u) {
        this.firstName = u.firstName || '';
        this.lastName = u.lastName || '';
        this.email = u.email || '';
        this.selectedRole = (u.role as UserRoleEnum) || UserRoleEnum.USER;
        this.companyId = u.company_id || '';
      } else {
        this.resetForm();
      }
    });
  }

  private resetForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.selectedRole = UserRoleEnum.USER;
    this.companyId = '';
  }

  protected onSubmit(): void {
    if (!this.firstName || !this.lastName || !this.email || !this.companyId) {
      return;
    }

    if (!this.isEditMode() && !this.password) {
      return;
    }

    const userData: User = {
      id: this.user()?.id || '',
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password || this.user()?.password || '',
      role: this.selectedRole,
      company_id: this.companyId,
    };

    this.save.emit(userData);
  }

  protected onCancel(): void {
    this.cancel.emit();
  }
}
