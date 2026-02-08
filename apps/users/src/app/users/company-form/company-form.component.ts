import { Component, ChangeDetectionStrategy, input, output, effect, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '@proto/ui-theme';
import { Company } from '@proto/api-interfaces';

@Component({
  selector: 'proto-company-form',
  standalone: true,
  imports: [FormsModule, ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditMode() ? 'Edit Company' : 'Add Company' }}</h2>
          <button class="close-btn" (click)="onCancel()">&times;</button>
        </div>

        <form class="modal-body" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Company Name</label>
            <input
              type="text"
              class="form-input"
              [(ngModel)]="name"
              name="name"
              required
              placeholder="Enter company name"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              class="form-input form-textarea"
              [(ngModel)]="description"
              name="description"
              required
              placeholder="Brief description of the company"
              rows="3"
            ></textarea>
          </div>

          <div class="modal-actions">
            <ui-action-button variant="secondary" (clicked)="onCancel()">
              Cancel
            </ui-action-button>
            <ui-action-button variant="primary" (clicked)="onSubmit()">
              {{ isEditMode() ? 'Save Changes' : 'Add Company' }}
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
      font-family: inherit;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-subtle);
    }

    .form-input::placeholder {
      color: var(--text-quaternary);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
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
export class CompanyFormComponent {
  readonly company = input<Company | null>(null);
  readonly save = output<Company>();
  readonly cancel = output<void>();

  protected name = '';
  protected description = '';

  protected readonly isEditMode = computed(() => !!this.company()?.id);

  constructor() {
    effect(() => {
      const c = this.company();
      if (c) {
        this.name = c.name || '';
        this.description = c.description || '';
      } else {
        this.resetForm();
      }
    });
  }

  private resetForm(): void {
    this.name = '';
    this.description = '';
  }

  protected onSubmit(): void {
    if (!this.name || !this.description) {
      return;
    }

    const companyData: Company = {
      id: this.company()?.id || undefined,
      name: this.name,
      description: this.description,
    };

    this.save.emit(companyData);
  }

  protected onCancel(): void {
    this.cancel.emit();
  }
}
