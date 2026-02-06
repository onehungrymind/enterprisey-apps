import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'ui-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="themeService.toggle()"
      [attr.aria-label]="'Switch to ' + (themeService.isDark() ? 'light' : 'dark') + ' mode'"
      class="toggle-track"
    >
      <div class="toggle-knob" [class.light]="themeService.isLight()">
        {{ themeService.isDark() ? '☽' : '☀' }}
      </div>
    </button>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .toggle-track {
      width: 48px;
      height: 26px;
      border-radius: 13px;
      padding: 3px;
      background: var(--toggle-bg);
      border: 1px solid var(--border-default);
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: background 0.3s, border-color 0.3s;
    }

    .toggle-track:hover {
      border-color: var(--border-strong);
    }

    .toggle-knob {
      width: 18px;
      height: 18px;
      border-radius: 9px;
      background: var(--accent, var(--accent-dashboard));
      transform: translateX(0);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      color: var(--text-inverse);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .toggle-knob.light {
      transform: translateX(22px);
    }
  `]
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
}
