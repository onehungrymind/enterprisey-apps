import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'ui-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="header">
      <div class="left">
        <div class="accent-dot" [style.background]="accentColor()"></div>
        <h1 class="title">
          <span class="title-main" [style.color]="accentColor()">{{ title() }}</span>
          @if (subtitle()) {
            <span class="title-sub">{{ subtitle() }}</span>
          }
        </h1>
        <ng-content select="[slot=nav]" />
      </div>
      <div class="right">
        <ng-content select="[slot=actions]" />
        <ng-content />
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }

    .header {
      border-bottom: 1px solid var(--border-default);
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--nav-bg);
      backdrop-filter: blur(20px);
      transition: background 0.4s, border-color 0.4s;
    }

    .left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .accent-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .title {
      font-size: 16px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .title-main {
      /* Color set via style binding */
    }

    .title-sub {
      color: var(--text-tertiary);
      font-weight: 400;
      margin-left: 8px;
    }

    .right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly accentColor = input('var(--accent)');
}
