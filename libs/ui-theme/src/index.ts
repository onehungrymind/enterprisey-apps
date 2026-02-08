/**
 * UI Theme Library
 *
 * This library provides:
 * - SCSS theme files (import in styles.scss)
 * - ThemeService for dark/light mode switching
 * - ThemeToggleComponent for theme toggle UI
 * - TypeScript utilities for domain theming
 *
 * SCSS Usage:
 *   @import 'libs/ui-theme/src/lib/styles/theme';
 *
 * Angular Usage:
 *   import { ThemeService, ThemeToggleComponent } from '@proto/ui-theme';
 */

// Theme Service
export { ThemeService, ColorTheme } from './lib/services/theme.service';

// Theme Toggle Component
export { ThemeToggleComponent } from './lib/components/theme-toggle/theme-toggle.component';

// Status Dot Component
export { StatusDotComponent, StatusType } from './lib/components/status-dot/status-dot.component';

// Avatar Component
export { AvatarComponent } from './lib/components/avatar/avatar.component';

// Progress Bar Component
export { ProgressBarComponent } from './lib/components/progress-bar/progress-bar.component';

// Metric Card Component
export { MetricCardComponent } from './lib/components/metric-card/metric-card.component';

// Filter Chip Component
export { FilterChipComponent } from './lib/components/filter-chip/filter-chip.component';

// Page Header Component
export { PageHeaderComponent } from './lib/components/page-header/page-header.component';

// Widget Component
export { WidgetComponent } from './lib/components/widget/widget.component';

// Action Button Component
export { ActionButtonComponent } from './lib/components/action-button/action-button.component';

// Confirm Dialog Component
export { ConfirmDialogComponent } from './lib/components/confirm-dialog/confirm-dialog.component';

// Domain theme configuration
export type DomainTheme =
  | 'dashboard'
  | 'ingress'
  | 'transformation'
  | 'reporting'
  | 'export'
  | 'users';

export const DOMAIN_THEMES: Record<DomainTheme, { name: string; color: string }> = {
  dashboard: { name: 'Dashboard', color: '#a78bfa' },
  ingress: { name: 'Ingress', color: '#34d399' },
  transformation: { name: 'Transformation', color: '#fbbf24' },
  reporting: { name: 'Reporting', color: '#60a5fa' },
  export: { name: 'Export', color: '#f472b6' },
  users: { name: 'Users', color: '#94a3b8' },
};

/**
 * Set the active domain theme on a target element.
 * @param theme The domain theme to apply
 * @param target The element to apply the theme to (defaults to document.body)
 */
export function setDomainTheme(theme: DomainTheme, target: HTMLElement = document.body): void {
  target.setAttribute('data-domain', theme);
}

/**
 * Get the current domain theme from an element.
 * @param target The element to check (defaults to document.body)
 */
export function getDomainTheme(target: HTMLElement = document.body): DomainTheme | null {
  return target.getAttribute('data-domain') as DomainTheme | null;
}
