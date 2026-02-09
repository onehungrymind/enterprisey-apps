import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

/**
 * Ingress-specific step definitions
 */

Then('I should see source filter chips', async ({ page }) => {
  await expect(page.locator('ui-filter-chip, [data-testid="filter-chip"]').first()).toBeVisible();
});

Then('the source status should be {string}', async ({ ingressPage }, status: string) => {
  const currentStatus = await ingressPage.getSourceStatus();
  expect(currentStatus.toLowerCase()).toContain(status.toLowerCase());
});

Given('there is a valid database source {string}', async ({ apiClient }, name: string) => {
  await apiClient.login();
  await apiClient.createSource({
    name,
    type: 'database',
    host: 'localhost',
    port: 5432,
    database: 'testdb',
  });
});

Given('there is an invalid database source {string}', async ({ apiClient }, name: string) => {
  await apiClient.login();
  await apiClient.createSource({
    name,
    type: 'database',
    host: 'invalid-host',
    port: 9999,
    database: 'nonexistent',
  });
});

Given('there is a connected source {string}', async ({ apiClient }, name: string) => {
  await apiClient.login();
  await apiClient.createSource({
    name,
    type: 'database',
    status: 'connected',
  });
});

Given('there is a disconnected source {string}', async ({ apiClient }, name: string) => {
  await apiClient.login();
  await apiClient.createSource({
    name,
    type: 'database',
    status: 'disconnected',
  });
});

Given('there is a synced source {string}', async ({ apiClient }, name: string) => {
  await apiClient.login();
  await apiClient.createSource({
    name,
    type: 'database',
    status: 'connected',
    lastSyncedAt: new Date().toISOString(),
  });
});

// Note: "I click on the schema tab" is handled by catchall.steps.ts with "I click on the {word} tab"

Then('I should see the discovered fields', async ({ page }) => {
  await expect(page.locator('[data-testid="schema-fields"], .schema-fields')).toBeVisible();
});

Then('each field should show name, type, and sample values', async ({ page }) => {
  const fields = page.locator('[data-testid="schema-field"], .schema-field');
  const count = await fields.count();
  expect(count).toBeGreaterThan(0);
});

Then('I should see a generated webhook URL', async ({ page }) => {
  await expect(page.getByText(/webhook.*url/i).first()).toBeVisible();
});

Then('I should see a secret token', async ({ page }) => {
  await expect(page.getByText(/secret|token/i).first()).toBeVisible();
});

Then('I should see an error in the error log', async ({ page }) => {
  await expect(page.locator('[data-testid="error-log"], .error-log').first()).toBeVisible();
});
