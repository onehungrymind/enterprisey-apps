import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'proto-create-dashboard-dialog',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="cancelled.emit()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <div class="header">
          <h2>Create Dashboard</h2>
          <button class="close-btn" (click)="cancelled.emit()">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="body">
          <div class="field">
            <label for="name">Dashboard Name</label>
            <input
              id="name"
              type="text"
              [(ngModel)]="name"
              placeholder="e.g., Sales Overview"
              autofocus
            />
          </div>

          <div class="field">
            <label for="description">Description</label>
            <textarea
              id="description"
              [(ngModel)]="description"
              placeholder="Brief description of this dashboard..."
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="footer">
          <button class="btn secondary" (click)="cancelled.emit()">Cancel</button>
          <button
            class="btn primary"
            [disabled]="!name().trim()"
            (click)="submit()"
          >
            Create Dashboard
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
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

    .dialog {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.2s ease;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-default);
    }

    .header h2 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .close-btn {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--text-quaternary);
      border-radius: 4px;
      transition: all 0.15s;
    }

    .close-btn:hover {
      background: var(--bg-surface-hover);
      color: var(--text-secondary);
    }

    .body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .field input,
    .field textarea {
      background: var(--bg-input);
      border: 1px solid var(--border-default);
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 13px;
      color: var(--text-primary);
      font-family: inherit;
      resize: none;
      transition: all 0.15s;
    }

    .field input:focus,
    .field textarea:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-subtle);
    }

    .field input::placeholder,
    .field textarea::placeholder {
      color: var(--text-quaternary);
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 20px;
      border-top: 1px solid var(--border-default);
    }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn.secondary {
      background: transparent;
      border: 1px solid var(--border-default);
      color: var(--text-secondary);
    }

    .btn.secondary:hover {
      background: var(--bg-surface-hover);
    }

    .btn.primary {
      background: var(--accent);
      border: 1px solid var(--accent);
      color: white;
    }

    .btn.primary:hover:not(:disabled) {
      filter: brightness(1.1);
    }

    .btn.primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class CreateDashboardDialogComponent {
  readonly created = output<{ name: string; description: string }>();
  readonly cancelled = output<void>();

  protected readonly name = signal('');
  protected readonly description = signal('');

  protected submit(): void {
    if (this.name().trim()) {
      this.created.emit({
        name: this.name().trim(),
        description: this.description().trim(),
      });
    }
  }
}
