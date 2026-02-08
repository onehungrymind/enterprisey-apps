import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'ui-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.grid-column]': 'gridColumn()',
  },
  template: `
    <div class="widget">
      <div class="header">
        <span class="title">{{ title() }}</span>
        <button type="button" class="menu-btn">⋯</button>
      </div>
      <div class="content">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .widget {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 14px;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.4s;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .widget:hover {
      border-color: var(--border-strong);
      box-shadow: var(--shadow-md);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .title {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .menu-btn {
      background: none;
      border: none;
      color: var(--text-ghost);
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      line-height: 1;
    }

    .menu-btn:hover {
      color: var(--text-tertiary);
    }

    .content {
      flex: 1;
    }
  `]
})
export class WidgetComponent {
  readonly title = input.required<string>();
  readonly span = input(1);
  protected readonly gridColumn = computed(() => `span ${this.span()}`);
}
