import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
  selector: 'ui-confirm-dialog',
  standalone: true,
  imports: [ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ title() }}</h2>
          <button class="close-btn" (click)="onCancel()">&times;</button>
        </div>

        <div class="modal-body">
          <p class="confirm-message">{{ message() }}</p>

          @if (details()) {
            <div class="confirm-details">{{ details() }}</div>
          }
        </div>

        <div class="modal-actions">
          <ui-action-button variant="secondary" (clicked)="onCancel()">
            {{ cancelLabel() }}
          </ui-action-button>
          <ui-action-button [variant]="confirmVariant()" (clicked)="onConfirm()">
            {{ confirmLabel() }}
          </ui-action-button>
        </div>
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
      max-width: 400px;
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

    .confirm-message {
      font-size: 14px;
      color: var(--text-primary);
      margin: 0 0 8px 0;
      line-height: 1.5;
    }

    .confirm-details {
      font-size: 13px;
      color: var(--text-secondary);
      padding: 12px;
      background: var(--bg-inset);
      border-radius: 6px;
      margin-top: 12px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 20px;
      border-top: 1px solid var(--border-default);
    }
  `]
})
export class ConfirmDialogComponent {
  readonly title = input('Confirm');
  readonly message = input('Are you sure?');
  readonly details = input<string | null>(null);
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly confirmVariant = input<'primary' | 'danger'>('danger');

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected onConfirm(): void {
    this.confirm.emit();
  }

  protected onCancel(): void {
    this.cancel.emit();
  }
}
