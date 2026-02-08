import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Company } from '@proto/api-interfaces';

@Component({
  selector: 'proto-companies-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="list-container">
      @for (company of companies(); track company.id) {
        <div
          class="list-item"
          [class.selected]="selectedCompanyId() === company.id"
          (click)="companySelected.emit(company.id!)"
        >
          <div class="company-icon">
            <span class="icon-letter">{{ company.name.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="company-info">
            <div class="company-name">{{ company.name }}</div>
            <div class="company-description">{{ company.description }}</div>
          </div>
          <div class="user-count">
            <span class="count-badge">{{ getUserCount(company.id!) }}</span>
          </div>
        </div>
      } @empty {
        <div class="empty-state">No companies found</div>
      }
    </div>
  `,
  styles: [`
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .list-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.15s;
      border-left: 2px solid transparent;
      border-bottom: 1px solid var(--border-subtle);
    }

    .list-item:hover {
      background: var(--bg-surface-hover);
    }

    .list-item.selected {
      background: var(--accent-subtle);
      border-left-color: var(--accent);
    }

    .company-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--accent-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-letter {
      font-size: 16px;
      font-weight: 600;
      color: var(--accent);
    }

    .company-info {
      flex: 1;
      min-width: 0;
    }

    .company-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .company-description {
      font-size: 12px;
      color: var(--text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .user-count {
      flex-shrink: 0;
    }

    .count-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      padding: 0 8px;
      background: var(--bg-inset);
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .empty-state {
      padding: 40px 20px;
      text-align: center;
      color: var(--text-tertiary);
      font-size: 14px;
    }
  `]
})
export class CompaniesListComponent {
  readonly companies = input<Company[]>([]);
  readonly selectedCompanyId = input<string | null>(null);
  readonly userCounts = input<Map<string, number>>(new Map());
  readonly companySelected = output<string>();

  getUserCount(companyId: string): number {
    return this.userCounts().get(companyId) || 0;
  }
}
