/**
 * UI Theme Library
 *
 * This library provides:
 * - SCSS theme files (import in styles.scss)
 * - TypeScript utilities for domain theming
 *
 * SCSS Usage:
 *   @import 'libs/ui-theme/src/lib/styles/theme';
 *
 * Or if path alias is configured:
 *   @import '@proto/ui-theme/styles/theme';
 */

// Domain theme configuration
export type DomainTheme =
  | 'dashboard'
  | 'ingress'
  | 'transformation'
  | 'reporting'
  | 'export'
  | 'users';

export const DOMAIN_THEMES: Record<DomainTheme, { name: string; color: string }> = {
  dashboard: { name: 'Dashboard', color: '#a855f7' },
  ingress: { name: 'Ingress', color: '#10b981' },
  transformation: { name: 'Transformation', color: '#f59e0b' },
  reporting: { name: 'Reporting', color: '#3b82f6' },
  export: { name: 'Export', color: '#f43f5e' },
  users: { name: 'Users', color: '#64748b' },
};

/**
 * Set the active domain theme on a target element.
 * @param theme The domain theme to apply
 * @param target The element to apply the theme to (defaults to document.body)
 */
export function setDomainTheme(theme: DomainTheme, target: HTMLElement = document.body): void {
  target.setAttribute('data-theme', theme);
}

/**
 * Get the current domain theme from an element.
 * @param target The element to check (defaults to document.body)
 */
export function getDomainTheme(target: HTMLElement = document.body): DomainTheme | null {
  return target.getAttribute('data-theme') as DomainTheme | null;
}
