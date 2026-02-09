import { Component, ChangeDetectionStrategy, input, output, effect, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '@proto/ui-theme';
import { TransformStep, StepType } from '@proto/api-interfaces';

interface StepTypeOption {
  value: StepType;
  label: string;
  icon: string;
  description: string;
}

const STEP_TYPE_OPTIONS: StepTypeOption[] = [
  { value: 'filter', label: 'Filter', icon: '\u2298', description: 'Remove rows that don\'t match a condition' },
  { value: 'map', label: 'Map', icon: '\u2192', description: 'Transform or rename columns' },
  { value: 'aggregate', label: 'Aggregate', icon: '\u03A3', description: 'Group and summarize data' },
  { value: 'join', label: 'Join', icon: '\u22C8', description: 'Combine data from multiple sources' },
  { value: 'sort', label: 'Sort', icon: '\u2195', description: 'Order rows by column values' },
  { value: 'deduplicate', label: 'Dedupe', icon: '\u229C', description: 'Remove duplicate rows' },
];

@Component({
  selector: 'proto-step-form',
  standalone: true,
  imports: [FormsModule, ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditMode() ? 'Edit Step' : 'Add Step' }}</h2>
          <button class="close-btn" (click)="onCancel()">&times;</button>
        </div>

        <form class="modal-body" (ngSubmit)="onSubmit()">
          <!-- Step Type (only for new steps) -->
          @if (!isEditMode()) {
            <div class="form-group">
              <label class="form-label">Step Type</label>
              <div class="type-grid">
                @for (type of stepTypeOptions; track type.value) {
                  <button
                    type="button"
                    class="type-card"
                    [class.selected]="selectedType() === type.value"
                    (click)="selectType(type.value)"
                  >
                    <span class="type-icon">{{ type.icon }}</span>
                    <span class="type-label">{{ type.label }}</span>
                  </button>
                }
              </div>
            </div>
          }

          <!-- Step Name -->
          <div class="form-group">
            <label class="form-label">Step Name</label>
            <input
              type="text"
              class="form-input"
              [(ngModel)]="name"
              name="name"
              required
              [placeholder]="namePlaceholder()"
            />
          </div>

          <!-- Type-specific configuration -->
          <div class="config-section">
            <div class="section-divider">
              <span class="divider-text">Configuration</span>
            </div>

            @switch (selectedType()) {
              @case ('filter') {
                <div class="form-group">
                  <label class="form-label">Condition</label>
                  <input
                    type="text"
                    class="form-input mono"
                    [(ngModel)]="configCondition"
                    name="condition"
                    placeholder="status = 'active' AND amount > 100"
                  />
                  <p class="form-hint">SQL-like WHERE condition</p>
                </div>
              }

              @case ('map') {
                <div class="form-group">
                  <label class="form-label">Expression</label>
                  <textarea
                    class="form-input form-textarea mono"
                    [(ngModel)]="configExpression"
                    name="expression"
                    placeholder="full_name = first_name || ' ' || last_name,&#10;amount_usd = amount * exchange_rate"
                    rows="4"
                  ></textarea>
                  <p class="form-hint">Column transformations (one per line)</p>
                </div>
              }

              @case ('aggregate') {
                <div class="form-group">
                  <label class="form-label">Group By</label>
                  <input
                    type="text"
                    class="form-input mono"
                    [(ngModel)]="configGroupBy"
                    name="groupBy"
                    placeholder="category, region"
                  />
                  <p class="form-hint">Columns to group by (comma-separated)</p>
                </div>
                <div class="form-group">
                  <label class="form-label">Metrics</label>
                  <textarea
                    class="form-input form-textarea mono"
                    [(ngModel)]="configMetrics"
                    name="metrics"
                    placeholder="total_amount = SUM(amount),&#10;avg_price = AVG(price),&#10;record_count = COUNT(*)"
                    rows="4"
                  ></textarea>
                  <p class="form-hint">Aggregation functions (one per line)</p>
                </div>
              }

              @case ('join') {
                <div class="form-group">
                  <label class="form-label">Join Type</label>
                  <select
                    class="form-input"
                    [(ngModel)]="configJoinType"
                    name="joinType"
                  >
                    <option value="inner">Inner Join</option>
                    <option value="left">Left Join</option>
                    <option value="right">Right Join</option>
                    <option value="full">Full Outer Join</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Join Condition</label>
                  <input
                    type="text"
                    class="form-input mono"
                    [(ngModel)]="configJoinCondition"
                    name="joinCondition"
                    placeholder="a.customer_id = b.id"
                  />
                  <p class="form-hint">ON clause for the join</p>
                </div>
              }

              @case ('sort') {
                <div class="form-group">
                  <label class="form-label">Order By</label>
                  <input
                    type="text"
                    class="form-input mono"
                    [(ngModel)]="configOrderBy"
                    name="orderBy"
                    placeholder="created_at DESC, name ASC"
                  />
                  <p class="form-hint">Columns to sort by with direction</p>
                </div>
              }

              @case ('deduplicate') {
                <div class="form-group">
                  <label class="form-label">Unique Columns</label>
                  <input
                    type="text"
                    class="form-input mono"
                    [(ngModel)]="configUniqueColumns"
                    name="uniqueColumns"
                    placeholder="email, phone"
                  />
                  <p class="form-hint">Columns to determine uniqueness (comma-separated)</p>
                </div>
                <div class="form-group">
                  <label class="form-label">Keep</label>
                  <select
                    class="form-input"
                    [(ngModel)]="configKeep"
                    name="keep"
                  >
                    <option value="first">First occurrence</option>
                    <option value="last">Last occurrence</option>
                  </select>
                </div>
              }
            }
          </div>

          <div class="modal-actions">
            <ui-action-button variant="secondary" (clicked)="onCancel()">
              Cancel
            </ui-action-button>
            <ui-action-button
              variant="primary"
              [disabled]="!isValid()"
              (clicked)="onSubmit()"
            >
              {{ isEditMode() ? 'Save Changes' : 'Add Step' }}
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
      max-width: 520px;
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

    .form-input.mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
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

    .form-hint {
      font-size: 11px;
      color: var(--text-quaternary);
      margin: 4px 0 0 0;
    }

    .type-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .type-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 14px 8px;
      background: var(--bg-inset);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .type-card:hover {
      border-color: var(--border-strong);
      background: var(--bg-surface-hover);
    }

    .type-card.selected {
      background: var(--accent-subtle);
      border-color: var(--accent);
    }

    .type-icon {
      font-size: 20px;
    }

    .type-label {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .config-section {
      margin-top: 8px;
    }

    .section-divider {
      display: flex;
      align-items: center;
      margin: 16px 0;
    }

    .section-divider::before,
    .section-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border-default);
    }

    .divider-text {
      padding: 0 12px;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-quaternary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
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
export class StepFormComponent {
  readonly step = input<TransformStep | null>(null);
  readonly pipelineId = input.required<string>();
  readonly nextOrder = input<number>(0);
  readonly save = output<TransformStep>();
  readonly cancel = output<void>();

  protected readonly stepTypeOptions = STEP_TYPE_OPTIONS;

  // Form fields
  protected name = '';
  protected selectedType = signal<StepType>('filter');

  // Filter config
  protected configCondition = '';

  // Map config
  protected configExpression = '';

  // Aggregate config
  protected configGroupBy = '';
  protected configMetrics = '';

  // Join config
  protected configJoinType = 'inner';
  protected configJoinCondition = '';

  // Sort config
  protected configOrderBy = '';

  // Dedupe config
  protected configUniqueColumns = '';
  protected configKeep = 'first';

  protected readonly isEditMode = computed(() => !!this.step()?.id);

  protected readonly namePlaceholder = computed(() => {
    const type = this.selectedType();
    const labels: Record<StepType, string> = {
      filter: 'e.g., Filter Active Users',
      map: 'e.g., Calculate Total Price',
      aggregate: 'e.g., Revenue by Region',
      join: 'e.g., Add Customer Details',
      sort: 'e.g., Sort by Date',
      deduplicate: 'e.g., Remove Duplicate Emails',
    };
    return labels[type] || 'Step name';
  });

  protected readonly isValid = computed(() => {
    if (!this.name.trim()) return false;

    const type = this.selectedType();
    switch (type) {
      case 'filter':
        return this.configCondition.trim().length > 0;
      case 'map':
        return this.configExpression.trim().length > 0;
      case 'aggregate':
        return this.configGroupBy.trim().length > 0 && this.configMetrics.trim().length > 0;
      case 'join':
        return this.configJoinCondition.trim().length > 0;
      case 'sort':
        return this.configOrderBy.trim().length > 0;
      case 'deduplicate':
        return this.configUniqueColumns.trim().length > 0;
      default:
        return false;
    }
  });

  constructor() {
    effect(() => {
      const s = this.step();
      if (s) {
        this.name = s.config['name'] || '';
        this.selectedType.set(s.type);
        this.loadConfig(s.config);
      } else {
        this.resetForm();
      }
    });
  }

  private loadConfig(config: Record<string, any>): void {
    this.configCondition = config['condition'] || '';
    this.configExpression = config['expression'] || '';
    this.configGroupBy = config['groupBy'] || '';
    this.configMetrics = config['metrics'] || '';
    this.configJoinType = config['joinType'] || 'inner';
    this.configJoinCondition = config['joinCondition'] || '';
    this.configOrderBy = config['orderBy'] || '';
    this.configUniqueColumns = config['uniqueColumns'] || '';
    this.configKeep = config['keep'] || 'first';
  }

  private resetForm(): void {
    this.name = '';
    this.selectedType.set('filter');
    this.configCondition = '';
    this.configExpression = '';
    this.configGroupBy = '';
    this.configMetrics = '';
    this.configJoinType = 'inner';
    this.configJoinCondition = '';
    this.configOrderBy = '';
    this.configUniqueColumns = '';
    this.configKeep = 'first';
  }

  protected selectType(type: StepType): void {
    this.selectedType.set(type);
  }

  protected onSubmit(): void {
    if (!this.name) {
      return;
    }

    const config = this.buildConfig();

    const stepData: TransformStep = {
      id: this.step()?.id || undefined,
      pipelineId: this.pipelineId(),
      order: this.step()?.order ?? this.nextOrder(),
      type: this.selectedType(),
      config,
      inputSchema: this.step()?.inputSchema || [],
      outputSchema: this.step()?.outputSchema || [],
    };

    this.save.emit(stepData);
  }

  private buildConfig(): Record<string, any> {
    const type = this.selectedType();
    const base = { name: this.name.trim() };

    switch (type) {
      case 'filter':
        return { ...base, condition: this.configCondition.trim() };
      case 'map':
        return { ...base, expression: this.configExpression.trim() };
      case 'aggregate':
        return {
          ...base,
          groupBy: this.configGroupBy.trim(),
          metrics: this.configMetrics.trim(),
        };
      case 'join':
        return {
          ...base,
          joinType: this.configJoinType,
          joinCondition: this.configJoinCondition.trim(),
        };
      case 'sort':
        return { ...base, orderBy: this.configOrderBy.trim() };
      case 'deduplicate':
        return {
          ...base,
          uniqueColumns: this.configUniqueColumns.trim(),
          keep: this.configKeep,
        };
      default:
        return base;
    }
  }

  protected onCancel(): void {
    this.cancel.emit();
  }
}
