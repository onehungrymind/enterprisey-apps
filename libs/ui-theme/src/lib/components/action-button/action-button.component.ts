import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

@Component({
  selector: 'ui-action-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="action-btn"
      [class]="variant()"
      (click)="clicked.emit()"
    >
      <ng-content />
    </button>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .action-btn {
      padding: 7px 16px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
      border: 1px solid transparent;
    }

    .action-btn:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    .action-btn:active {
      transform: translateY(0);
    }

    .action-btn.primary {
      background: linear-gradient(135deg, var(--accent-strong, var(--accent)), var(--accent));
      color: var(--text-inverse);
      font-weight: 700;
    }

    .action-btn.secondary {
      background: var(--bg-surface-hover);
      border-color: var(--border-default);
      color: var(--text-tertiary);
    }

    .action-btn.ghost {
      background: transparent;
      color: var(--text-quaternary);
    }

    .action-btn.ghost:hover {
      background: var(--bg-surface-hover);
      color: var(--text-tertiary);
    }

    .action-btn.danger {
      background: var(--color-danger-subtle);
      border-color: var(--border-default);
      color: var(--color-danger);
    }
  `]
})
export class ActionButtonComponent {
  readonly variant = input<ButtonVariant>('secondary');
  readonly clicked = output<void>();
}
