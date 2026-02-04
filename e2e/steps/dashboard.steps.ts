import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';

Given('I am on the dashboard', async ({ page }) => {
  await page.goto('/');
});

Then('I should see the home page', async ({ page }) => {
  await expect(page.locator('proto-root')).toBeVisible();
});

When('I click the {string} navigation link', async ({ page }, linkText: string) => {
  await page.getByRole('link', { name: linkText }).click();
});

Then('I should see the ingress page', async ({ page }) => {
  await expect(page).toHaveURL(/\/ingress/);
});
