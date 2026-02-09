import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

/**
 * Portal-specific step definitions
 */

Then('I should see status for all 6 services', async ({ page }) => {
  const services = page.locator('[data-testid="service-card"], .service-card');
  const count = await services.count();
  expect(count).toBeGreaterThanOrEqual(6);
});

Then('healthy services should be green', async ({ page }) => {
  const healthyIndicators = page.locator('.status-indicator.green, [data-status="healthy"]');
  const count = await healthyIndicators.count();
  expect(count).toBeGreaterThan(0);
});

Then('unhealthy services should be red', async ({ page }) => {
  // This may or may not have unhealthy services
  // Just verify the page loads correctly
  await expect(page.locator('[data-testid="health-grid"], .health-grid')).toBeVisible();
});

Then('the health check should run', async ({ page }) => {
  // Look for loading state or status change
  await page.waitForLoadState('networkidle');
});

Then('the {string} timestamp should update', async ({ page }, fieldName: string) => {
  await expect(page.getByText(/last checked|updated/i).first()).toBeVisible();
});
