import { Component, ChangeDetectionStrategy, input, output, effect, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionButtonComponent } from '@proto/ui-theme';
import { DataSource, DataSourceType } from '@proto/api-interfaces';

interface TypeOption {
  value: DataSourceType;
  label: string;
  icon: string;
}

const TYPE_OPTIONS: TypeOption[] = [
  { value: 'database', label: 'Database', icon: '⛁' },
  { value: 'rest_api', label: 'REST API', icon: '⇄' },
  { value: 'csv_file', label: 'CSV File', icon: '▤' },
  { value: 'webhook', label: 'Webhook', icon: '⚡' },
];

const FREQUENCY_OPTIONS = [
  'Manual',
  'Real-time',
  'Every 5 min',
  'Every 15 min',
  'Every 30 min',
  'Hourly',
  'Daily',
];

@Component({
  selector: 'proto-source-form',
  standalone: true,
  imports: [FormsModule, ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditMode() ? 'Configure Source' : 'New Data Source' }}</h2>
          <button class="close-btn" (click)="onCancel()">&times;</button>
        </div>

        <form class="modal-body" (ngSubmit)="onSubmit()">
          <!-- Source Type Selection (only for new sources) -->
          @if (!isEditMode()) {
            <div class="form-group">
              <label class="form-label">Source Type</label>
              <div class="type-grid">
                @for (type of typeOptions; track type.value) {
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

          <!-- Common Fields -->
          <div class="form-group">
            <label class="form-label">Source Name</label>
            <input
              type="text"
              class="form-input"
              [(ngModel)]="name"
              name="name"
              required
              placeholder="e.g., Production PostgreSQL"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Sync Frequency</label>
            <select
              class="form-input"
              [(ngModel)]="syncFrequency"
              name="syncFrequency"
            >
              @for (freq of frequencyOptions; track freq) {
                <option [value]="freq">{{ freq }}</option>
              }
            </select>
          </div>

          <!-- Dynamic Config Fields -->
          <div class="config-section">
            <div class="section-divider">
              <span class="divider-text">Connection Settings</span>
            </div>

            @switch (selectedType()) {
              @case ('database') {
                <div class="form-row">
                  <div class="form-group flex-2">
                    <label class="form-label">Host</label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="configHost"
                      name="host"
                      placeholder="localhost"
                    />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Port</label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="configPort"
                      name="port"
                      placeholder="5432"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Database</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="configDatabase"
                    name="database"
                    placeholder="mydb"
                  />
                </div>
                <div class="form-row">
                  <div class="form-group flex-1">
                    <label class="form-label">Username</label>
                    <input
                      type="text"
                      class="form-input"
                      [(ngModel)]="configUser"
                      name="user"
                      placeholder="postgres"
                    />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Password</label>
                    <input
                      type="password"
                      class="form-input"
                      [(ngModel)]="configPassword"
                      name="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              }

              @case ('rest_api') {
                <div class="form-group">
                  <label class="form-label">API URL</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="configUrl"
                    name="url"
                    placeholder="https://api.example.com/v1/data"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Method</label>
                  <select
                    class="form-input"
                    [(ngModel)]="configMethod"
                    name="method"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Headers (JSON)</label>
                  <textarea
                    class="form-input form-textarea"
                    [(ngModel)]="configHeaders"
                    name="headers"
                    placeholder='{"Authorization": "Bearer token"}'
                    rows="3"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Data Path (optional)</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="configDataPath"
                    name="dataPath"
                    placeholder="data.items"
                  />
                </div>
              }

              @case ('csv_file') {
                <div class="form-group">
                  <label class="form-label">File Path or URL</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="configFilePath"
                    name="filePath"
                    placeholder="/path/to/file.csv or https://..."
                  />
                </div>
                <div class="form-row">
                  <div class="form-group flex-1">
                    <label class="form-label">Delimiter</label>
                    <select
                      class="form-input"
                      [(ngModel)]="configDelimiter"
                      name="delimiter"
                    >
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\t">Tab</option>
                      <option value="|">Pipe (|)</option>
                    </select>
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Has Header Row</label>
                    <select
                      class="form-input"
                      [(ngModel)]="configHasHeader"
                      name="hasHeader"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              }

              @case ('webhook') {
                <div class="form-group">
                  <label class="form-label">Webhook Endpoint</label>
                  <div class="readonly-field">
                    <span class="endpoint-url">{{ webhookEndpoint() }}</span>
                    <button type="button" class="copy-btn" (click)="copyEndpoint()">Copy</button>
                  </div>
                  <p class="form-hint">POST data to this URL to ingest records</p>
                </div>
                <div class="form-group">
                  <label class="form-label">Secret Token</label>
                  <input
                    type="text"
                    class="form-input"
                    [(ngModel)]="configSecret"
                    name="secret"
                    placeholder="your-secret-token"
                  />
                  <p class="form-hint">Include in X-Webhook-Secret header</p>
                </div>
              }
            }
          </div>

          <div class="modal-actions">
            <ui-action-button variant="secondary" (clicked)="onCancel()">
              Cancel
            </ui-action-button>
            <ui-action-button variant="primary" (clicked)="onSubmit()">
              {{ isEditMode() ? 'Save Changes' : 'Create Source' }}
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
      max-width: 560px;
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

    .form-row {
      display: flex;
      gap: 12px;
    }

    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }

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
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
    }

    .form-hint {
      font-size: 11px;
      color: var(--text-quaternary);
      margin: 4px 0 0 0;
    }

    .type-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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

    .readonly-field {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: var(--bg-code);
      border: 1px solid var(--border-default);
      border-radius: 6px;
    }

    .endpoint-url {
      flex: 1;
      font-size: 12px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .copy-btn {
      padding: 4px 10px;
      font-size: 10px;
      font-weight: 600;
      background: var(--bg-surface-hover);
      border: 1px solid var(--border-default);
      border-radius: 4px;
      color: var(--text-tertiary);
      cursor: pointer;
      transition: all 0.15s;
    }

    .copy-btn:hover {
      background: var(--accent-subtle);
      color: var(--accent);
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
export class SourceFormComponent {
  readonly source = input<DataSource | null>(null);
  readonly save = output<DataSource>();
  readonly cancel = output<void>();

  protected readonly typeOptions = TYPE_OPTIONS;
  protected readonly frequencyOptions = FREQUENCY_OPTIONS;

  // Form fields
  protected name = '';
  protected syncFrequency = 'Hourly';
  protected selectedType = signal<DataSourceType>('database');

  // Database config
  protected configHost = '';
  protected configPort = '5432';
  protected configDatabase = '';
  protected configUser = '';
  protected configPassword = '';

  // REST API config
  protected configUrl = '';
  protected configMethod = 'GET';
  protected configHeaders = '';
  protected configDataPath = '';

  // CSV config
  protected configFilePath = '';
  protected configDelimiter = ',';
  protected configHasHeader = 'true';

  // Webhook config
  protected configSecret = '';

  protected readonly isEditMode = computed(() => !!this.source()?.id);

  protected readonly webhookEndpoint = computed(() => {
    const src = this.source();
    if (src?.id) {
      return `${window.location.origin}/api/webhooks/${src.id}`;
    }
    return `${window.location.origin}/api/webhooks/<source-id>`;
  });

  constructor() {
    effect(() => {
      const src = this.source();
      if (src) {
        this.name = src.name || '';
        this.syncFrequency = src.syncFrequency || 'Hourly';
        this.selectedType.set(src.type || 'database');
        this.loadConfig(src.connectionConfig || {});
      } else {
        this.resetForm();
      }
    });
  }

  private loadConfig(config: Record<string, string>): void {
    // Database
    this.configHost = config['host'] || '';
    this.configPort = config['port'] || '5432';
    this.configDatabase = config['database'] || '';
    this.configUser = config['user'] || '';
    this.configPassword = config['password'] || '';

    // REST API
    this.configUrl = config['url'] || '';
    this.configMethod = config['method'] || 'GET';
    this.configHeaders = config['headers'] || '';
    this.configDataPath = config['dataPath'] || '';

    // CSV
    this.configFilePath = config['filePath'] || config['url'] || '';
    this.configDelimiter = config['delimiter'] || ',';
    this.configHasHeader = config['hasHeader'] || 'true';

    // Webhook
    this.configSecret = config['secret'] || '';
  }

  private resetForm(): void {
    this.name = '';
    this.syncFrequency = 'Hourly';
    this.selectedType.set('database');
    this.configHost = '';
    this.configPort = '5432';
    this.configDatabase = '';
    this.configUser = '';
    this.configPassword = '';
    this.configUrl = '';
    this.configMethod = 'GET';
    this.configHeaders = '';
    this.configDataPath = '';
    this.configFilePath = '';
    this.configDelimiter = ',';
    this.configHasHeader = 'true';
    this.configSecret = '';
  }

  protected selectType(type: DataSourceType): void {
    this.selectedType.set(type);
  }

  protected copyEndpoint(): void {
    navigator.clipboard.writeText(this.webhookEndpoint());
  }

  protected onSubmit(): void {
    if (!this.name) {
      return;
    }

    const connectionConfig = this.buildConnectionConfig();

    const sourceData: DataSource = {
      id: this.source()?.id || undefined,
      name: this.name,
      type: this.selectedType(),
      connectionConfig,
      syncFrequency: this.syncFrequency,
      status: this.source()?.status || 'disconnected',
      lastSyncAt: this.source()?.lastSyncAt || null,
      errorLog: this.source()?.errorLog || [],
      createdBy: this.source()?.createdBy || 'current-user',
    };

    this.save.emit(sourceData);
  }

  private buildConnectionConfig(): Record<string, string> {
    const type = this.selectedType();

    switch (type) {
      case 'database':
        return {
          host: this.configHost,
          port: this.configPort,
          database: this.configDatabase,
          user: this.configUser,
          password: this.configPassword,
        };

      case 'rest_api':
        return {
          url: this.configUrl,
          method: this.configMethod,
          headers: this.configHeaders,
          dataPath: this.configDataPath,
        };

      case 'csv_file':
        return {
          filePath: this.configFilePath,
          url: this.configFilePath,
          delimiter: this.configDelimiter,
          hasHeader: this.configHasHeader,
        };

      case 'webhook':
        return {
          secret: this.configSecret,
          endpoint: this.webhookEndpoint(),
        };

      default:
        return {};
    }
  }

  protected onCancel(): void {
    this.cancel.emit();
  }
}
