import { Component, ChangeDetectionStrategy, input, output, effect, computed, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActionButtonComponent } from '@proto/ui-theme';
import { Pipeline, PipelineStatus, DataSource } from '@proto/api-interfaces';
import { SourcesService } from '@proto/ingress-data';

const STATUS_OPTIONS: { value: PipelineStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
];

@Component({
  selector: 'proto-pipeline-form',
  standalone: true,
  imports: [FormsModule, ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditMode() ? 'Edit Pipeline' : 'New Pipeline' }}</h2>
          <button class="close-btn" (click)="onCancel()">&times;</button>
        </div>

        <form class="modal-body" (ngSubmit)="onSubmit()">
          <!-- Pipeline Name -->
          <div class="form-group">
            <label class="form-label">Pipeline Name</label>
            <input
              type="text"
              class="form-input"
              [(ngModel)]="name"
              name="name"
              required
              placeholder="e.g., Customer Data Cleanup"
            />
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              class="form-input form-textarea"
              [(ngModel)]="description"
              name="description"
              placeholder="Describe what this pipeline does..."
              rows="3"
            ></textarea>
          </div>

          <!-- Source Selection -->
          <div class="form-group">
            <label class="form-label">Data Source</label>
            @if (loadingSources()) {
              <div class="loading-indicator">Loading sources...</div>
            } @else if (sources().length === 0) {
              <div class="empty-sources">
                <span>No data sources available.</span>
                <span class="hint">Create a source in the Ingress app first.</span>
              </div>
            } @else {
              <select
                class="form-input"
                [(ngModel)]="sourceId"
                name="sourceId"
                required
              >
                <option value="">Select a data source...</option>
                @for (source of sources(); track source.id) {
                  <option [value]="source.id">
                    {{ source.name }} ({{ source.type }})
                  </option>
                }
              </select>
            }
          </div>

          <!-- Status (only for edit mode) -->
          @if (isEditMode()) {
            <div class="form-group">
              <label class="form-label">Status</label>
              <select
                class="form-input"
                [(ngModel)]="status"
                name="status"
              >
                @for (opt of statusOptions; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            </div>
          }

          <div class="modal-actions">
            <ui-action-button variant="secondary" (clicked)="onCancel()">
              Cancel
            </ui-action-button>
            <ui-action-button
              variant="primary"
              [disabled]="!isValid()"
              (clicked)="onSubmit()"
            >
              {{ isEditMode() ? 'Save Changes' : 'Create Pipeline' }}
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

    .loading-indicator {
      padding: 12px;
      text-align: center;
      color: var(--text-tertiary);
      font-size: 13px;
    }

    .empty-sources {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px;
      background: var(--bg-inset);
      border: 1px solid var(--border-default);
      border-radius: 6px;
      color: var(--text-secondary);
      font-size: 13px;
    }

    .empty-sources .hint {
      font-size: 11px;
      color: var(--text-quaternary);
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
export class PipelineFormComponent implements OnInit {
  readonly pipeline = input<Pipeline | null>(null);
  readonly save = output<Pipeline>();
  readonly cancel = output<void>();

  private readonly sourcesService = inject(SourcesService);

  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly loadingSources = signal(true);

  // Fetch sources from Ingress API
  private readonly apiSources = toSignal(this.sourcesService.all(), { initialValue: [] });

  protected readonly sources = computed(() => {
    const allSources = this.apiSources();
    this.loadingSources.set(false);
    // Only show connected sources for pipeline creation
    return allSources.filter(s => s.status === 'connected' || s.id === this.pipeline()?.sourceId);
  });

  // Form fields
  protected name = '';
  protected description = '';
  protected sourceId = '';
  protected status: PipelineStatus = 'draft';

  protected readonly isEditMode = computed(() => !!this.pipeline()?.id);

  protected readonly isValid = computed(() => {
    return this.name.trim().length > 0 && this.sourceId.length > 0;
  });

  constructor() {
    effect(() => {
      const p = this.pipeline();
      if (p) {
        this.name = p.name || '';
        this.description = p.description || '';
        this.sourceId = p.sourceId || '';
        this.status = p.status || 'draft';
      } else {
        this.resetForm();
      }
    });
  }

  ngOnInit(): void {
    // Sources are loaded via toSignal
  }

  private resetForm(): void {
    this.name = '';
    this.description = '';
    this.sourceId = '';
    this.status = 'draft';
  }

  protected onSubmit(): void {
    if (!this.name || !this.sourceId) {
      return;
    }

    const pipelineData: Pipeline = {
      id: this.pipeline()?.id || undefined,
      name: this.name.trim(),
      description: this.description.trim(),
      sourceId: this.sourceId,
      steps: this.pipeline()?.steps || [],
      status: this.status,
      lastRunAt: this.pipeline()?.lastRunAt || null,
      createdBy: this.pipeline()?.createdBy || 'current-user',
    };

    this.save.emit(pipelineData);
  }

  protected onCancel(): void {
    this.cancel.emit();
  }
}
