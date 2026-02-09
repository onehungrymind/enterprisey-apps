import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from '../support/selectors';
import { PAGES } from '../support/test-data';

/**
 * Reporting page object for dashboard management
 */
export class ReportingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to reporting app
   */
  async goto(): Promise<void> {
    await this.page.goto(PAGES.reporting);
    await this.waitForLoadState();
  }

  /**
   * Verify dashboards sidebar is visible
   */
  async expectDashboardsSidebarVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.reporting.dashboardList)).toBeVisible();
  }

  /**
   * Click new dashboard button
   */
  async clickNewDashboard(): Promise<void> {
    await this.page.locator(SELECTORS.reporting.newDashboardButton).click();
  }

  /**
   * Select a dashboard by name
   */
  async selectDashboard(name: string): Promise<void> {
    await this.page.locator(SELECTORS.reporting.dashboardItem(name)).click();
  }

  /**
   * Verify dashboard is in sidebar
   */
  async expectDashboardInSidebar(name: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.reporting.dashboardItem(name))).toBeVisible();
  }

  /**
   * Verify widget grid is visible
   */
  async expectWidgetGridVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.reporting.widgetGrid)).toBeVisible();
  }

  /**
   * Verify widget is visible
   */
  async expectWidgetVisible(title: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.reporting.widget(title))).toBeVisible();
  }

  /**
   * Verify metric card is visible
   */
  async expectMetricCardVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.reporting.metricCard).first()).toBeVisible();
  }

  /**
   * Click date filter chip
   */
  async clickDateFilter(range: string): Promise<void> {
    await this.page.locator(SELECTORS.filters.chip(range)).click();
  }

  /**
   * Verify date filter is active
   */
  async expectDateFilterActive(range: string): Promise<void> {
    const chip = this.page.locator(SELECTORS.filters.chip(range));
    await expect(chip).toHaveClass(/active/);
  }

  /**
   * Fill dashboard form
   */
  async fillDashboardForm(data: {
    name: string;
    description?: string;
  }): Promise<void> {
    await this.fillField('Dashboard Name', data.name);
    if (data.description) {
      await this.fillField('Description', data.description);
    }
  }

  /**
   * Wait for widgets to load
   */
  async waitForWidgetsToLoad(): Promise<void> {
    await this.waitForLoading();
    // Wait a bit more for chart rendering
    await this.page.waitForTimeout(500);
  }
}
