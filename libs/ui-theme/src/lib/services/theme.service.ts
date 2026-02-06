import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ColorTheme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'enterprisey-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _theme = signal<ColorTheme>(this.getInitialTheme());

  readonly theme = this._theme.asReadonly();
  readonly isDark = () => this._theme() === 'dark';
  readonly isLight = () => this._theme() === 'light';

  constructor() {
    // Sync theme changes to DOM and localStorage
    effect(() => {
      const theme = this._theme();
      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    });
  }

  toggle(): void {
    this._theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: ColorTheme): void {
    this._theme.set(theme);
  }

  private getInitialTheme(): ColorTheme {
    if (!isPlatformBrowser(this.platformId)) {
      return 'dark';
    }

    // Check localStorage first
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }

    // Check system preference
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
      return 'light';
    }

    return 'dark';
  }
}
