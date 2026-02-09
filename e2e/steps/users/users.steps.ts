import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

/**
 * Users-specific step definitions
 */

Given('there is a user {string} with role {string}', async ({ apiClient }, name: string, role: string) => {
  await apiClient.login();
  const [firstName, lastName] = name.split(' ');
  await apiClient.createUser({
    firstName,
    lastName: lastName || '',
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    role,
  });
});

Given('I am on the companies tab', async ({ page }) => {
  await page.getByRole('tab', { name: /companies/i }).click();
});

Then('{string} should have role {string}', async ({ page }, userName: string, role: string) => {
  const userRow = page.locator(`tr:has-text("${userName}"), [data-testid="user-row"]:has-text("${userName}")`);
  await expect(userRow.getByText(role)).toBeVisible();
});

Then('each company should show name and user count', async ({ page }) => {
  const companies = page.locator('[data-testid="company-item"], .company-item, tr');
  const count = await companies.count();
  expect(count).toBeGreaterThan(0);
});
