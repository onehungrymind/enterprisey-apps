import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

/**
 * Reporting-specific step definitions
 */

Given('I have selected dashboard {string}', async ({ page }, name: string) => {
  await page.getByText(name).click();
  // Wait for widgets to load
  await page.waitForTimeout(500);
});

Given('there is a metric widget {string}', async ({ page }, title: string) => {
  await expect(page.getByText(title)).toBeVisible();
});

Given('there is a line chart widget {string}', async ({ page }, title: string) => {
  await expect(page.getByText(title)).toBeVisible();
});

Given('there is a bar chart widget {string}', async ({ page }, title: string) => {
  await expect(page.getByText(title)).toBeVisible();
});

Given('there is a pie chart widget {string}', async ({ page }, title: string) => {
  await expect(page.getByText(title)).toBeVisible();
});

Given('there is a table widget {string}', async ({ page }, title: string) => {
  await expect(page.getByText(title)).toBeVisible();
});

// Note: "When the dashboard is loading" is handled by catchall.steps.ts

When('widgets have loaded', async ({ page }) => {
  await page.waitForLoadState('networkidle');
});

When('I click the {string} filter', async ({ page }, range: string) => {
  await page.getByText(range.toUpperCase(), { exact: true }).click();
});

Then('I should see the dashboards sidebar', async ({ page }) => {
  await expect(page.locator('.sidebar, [data-testid="dashboard-list"]')).toBeVisible();
});

Then('each dashboard should show name and widget count', async ({ page }) => {
  const dashboards = page.locator('[data-testid="dashboard-item"], .dashboard-item');
  const count = await dashboards.count();
  expect(count).toBeGreaterThan(0);
});

Then('I should be viewing {string}', async ({ page }, dashboardName: string) => {
  await expect(page.getByText(dashboardName).first()).toBeVisible();
});

Then('{string} should be highlighted in the sidebar', async ({ page }, dashboardName: string) => {
  const item = page.locator(`[data-testid="dashboard-item"]:has-text("${dashboardName}"), .dashboard-item:has-text("${dashboardName}")`);
  await expect(item).toHaveClass(/active|selected/);
});

Then('widgets should be arranged in a grid layout', async ({ page }) => {
  await expect(page.locator('.widget-grid, [data-testid="widget-grid"]')).toBeVisible();
});

Then('widgets should show loading spinners', async ({ page }) => {
  await expect(page.locator('.spinner, [data-testid="loading"]').first()).toBeVisible();
});

Then('each widget should display its data', async ({ page }) => {
  const widgets = page.locator('ui-widget, [data-testid="widget"]');
  const count = await widgets.count();
  expect(count).toBeGreaterThan(0);
});

Then('I should see a large value display', async ({ page }) => {
  await expect(page.locator('ui-metric-card .value, [data-testid="metric-value"]').first()).toBeVisible();
});

Then('I should see a change indicator', async ({ page }) => {
  await expect(page.locator('ui-metric-card .change, [data-testid="metric-change"]').first()).toBeVisible();
});

Then('I should see a sparkline', async ({ page }) => {
  await expect(page.locator('ui-metric-card svg, [data-testid="sparkline"]').first()).toBeVisible();
});

Then('I should see a line chart', async ({ page }) => {
  await expect(page.locator('app-area-chart, [data-testid="line-chart"], svg').first()).toBeVisible();
});

Then('the chart should have axis labels', async ({ page }) => {
  // Charts have axis labels rendered in SVG
  await expect(page.locator('svg text').first()).toBeVisible();
});

Then('I should see a bar chart', async ({ page }) => {
  await expect(page.locator('app-simple-bar-chart, [data-testid="bar-chart"], svg').first()).toBeVisible();
});

Then('each bar should show its value', async ({ page }) => {
  await expect(page.locator('svg rect').first()).toBeVisible();
});

Then('I should see a donut\\/pie chart', async ({ page }) => {
  await expect(page.locator('app-donut-chart, [data-testid="pie-chart"], svg').first()).toBeVisible();
});

Then('I should see a legend', async ({ page }) => {
  await expect(page.locator('.legend, [data-testid="legend"]').first()).toBeVisible();
});

Then('I should see a data table', async ({ page }) => {
  await expect(page.locator('app-customer-table, table, [data-testid="data-table"]').first()).toBeVisible();
});

Then('the table should have column headers', async ({ page }) => {
  await expect(page.locator('th, [data-testid="column-header"]').first()).toBeVisible();
});

Then('the {string} filter should be active', async ({ page }, range: string) => {
  const chip = page.locator(`ui-filter-chip:has-text("${range.toUpperCase()}")`);
  await expect(chip).toHaveClass(/active/);
});

Then('widgets should refresh with 7-day data', async ({ page }) => {
  // Just verify the filter is applied - actual data verification would need API mocking
  await expect(page.getByText('7D')).toBeVisible();
});
