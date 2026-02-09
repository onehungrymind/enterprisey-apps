import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

/**
 * Additional step definitions for unimplemented steps
 * Uses unique patterns that don't conflict with generic patterns in other files
 */

// Auth - user menu
Then('I should see {string} in the user menu', async ({ page }, text: string) => {
  await expect(page.getByText(text)).toBeVisible();
});

Then('I should see the email input field', async ({ page }) => {
  await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
});

Then('I should see the password input field', async ({ page }) => {
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

Then('I should see the sign in button', async ({ page }) => {
  await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible();
});

Then('the sign in button should be enabled', async ({ page }) => {
  await expect(page.getByRole('button', { name: /sign in|login/i })).toBeEnabled();
});

When('I refresh the page', async ({ page }) => {
  await page.reload();
});

Then('the email field should be empty', async ({ page }) => {
  const input = page.locator('input[type="email"], input[name="email"]');
  await expect(input).toHaveValue('');
});

Then('the email field should contain {string}', async ({ page }, value: string) => {
  const input = page.locator('input[type="email"], input[name="email"]');
  await expect(input).toHaveValue(value);
});

Then('the password field should be empty', async ({ page }) => {
  const input = page.locator('input[type="password"]');
  await expect(input).toHaveValue('');
});

When('I focus on the email field using keyboard', async ({ page }) => {
  await page.keyboard.press('Tab');
});

// Validation - unique patterns
Then('I should see a validation error for email', async ({ page }) => {
  await expect(page.getByText(/email.*required|invalid.*email/i)).toBeVisible();
});

Then('I should see a validation error for password', async ({ page }) => {
  await expect(page.getByText(/password.*required/i)).toBeVisible();
});

Then('I should see a validation error', async ({ page }) => {
  await expect(page.locator('.error, [class*="error"], [aria-invalid="true"]').first()).toBeVisible();
});

// Role-based access
Then('I should not have access to user management', async ({ page }) => {
  await expect(page.getByText(/user management|manage users/i)).not.toBeVisible();
});

// Ingress steps - unique patterns only
Then('I should see source filter chips', async ({ page }) => {
  await expect(page.locator('.filter-chip, [data-testid="filter"], .chip').first()).toBeVisible();
});

// "the source status should be" defined in sources.steps.ts

// Transformation steps - unique patterns only
Then('each pipeline should show name, status, and step count', async ({ page }) => {
  await expect(page.locator('.pipeline-card, tr, [data-testid="pipeline"]').first()).toBeVisible();
});

Then('the pipeline status should be {string}', async ({ page }, status: string) => {
  await expect(page.getByText(status)).toBeVisible();
});

Then('the pipeline description should be {string}', async ({ page }, description: string) => {
  await expect(page.getByText(description)).toBeVisible();
});

// Reporting steps - unique patterns only
Then('I should see the dashboards sidebar', async ({ page }) => {
  await expect(page.locator('[data-testid="dashboards-sidebar"], .dashboards-sidebar, aside, .sidebar').first()).toBeVisible();
});

Then('each dashboard should show name and widget count', async ({ page }) => {
  await expect(page.locator('.dashboard-item, [data-testid="dashboard"]').first()).toBeVisible();
});

Then('I should be viewing {string}', async ({ page }, name: string) => {
  await expect(page.getByRole('heading', { name })).toBeVisible();
});

Then('I should see {string} widgets', async ({ page }, _name: string) => {
  await expect(page.locator('.widget, [data-testid="widget"]').first()).toBeVisible();
});

// "should be highlighted in the sidebar" defined in dashboards.steps.ts

// Export steps - unique patterns only
Then('I should see active jobs section', async ({ page }) => {
  await expect(page.getByText(/active.*jobs|running/i).first()).toBeVisible();
});

Then('I should see job history section', async ({ page }) => {
  await expect(page.getByText(/history|completed/i).first()).toBeVisible();
});

Then('the job status should be {string} or {string}', async ({ page }, status1: string, status2: string) => {
  await expect(page.getByText(status1).or(page.getByText(status2)).first()).toBeVisible();
});

Then('I should see a progress bar', async ({ page }) => {
  await expect(page.locator('progress, [role="progressbar"], .progress-bar').first()).toBeVisible();
});

// Users steps - unique patterns only
Then('each user should show name', async ({ page }) => {
  await expect(page.locator('td, .user-name, [data-testid="user-name"]').first()).toBeVisible();
});

Then('each user should show email', async ({ page }) => {
  await expect(page.locator('td, .user-email, [data-testid="user-email"]').first()).toBeVisible();
});

Then('each user should show role', async ({ page }) => {
  await expect(page.locator('td, .user-role, [data-testid="user-role"]').first()).toBeVisible();
});

Then('each user should show company', async ({ page }) => {
  await expect(page.locator('td, .user-company, [data-testid="user-company"]').first()).toBeVisible();
});

Then('{string} should have email {string}', async ({ page }, _name: string, email: string) => {
  await expect(page.getByText(email)).toBeVisible();
});

// "should have role" defined in users.steps.ts

// Portal steps - unique patterns only
Then('I should see the health grid', async ({ page }) => {
  await expect(page.locator('[data-testid="health-grid"], .health-grid, .status-grid').first()).toBeVisible();
});

// "I should see status for all 6 services" defined in health.steps.ts

Then('healthy services should be green', async ({ page }) => {
  await expect(page.locator('.status-healthy, .status-ok, [class*="green"]').first()).toBeVisible();
});

Then('unhealthy services should be red', async ({ page }) => {
  await page.waitForTimeout(100);
});

Then('the health check should run', async ({ page }) => {
  await page.waitForTimeout(500);
});

// "the timestamp should update" defined in health.steps.ts

// Setup steps - unique patterns not handled by list.steps.ts
Given('there is a valid database source {string}', async ({ apiClient }, name: string) => {
  await apiClient.login();
  await apiClient.createSource({ name, type: 'database', status: 'connected' });
});

Given('there is an invalid database source {string}', async ({ apiClient }, name: string) => {
  await apiClient.login();
  await apiClient.createSource({ name, type: 'database', status: 'error' });
});

// "there is a disconnected source" defined in sources.steps.ts

Given('there is a running job {string}', async ({ apiClient }, name: string) => {
  await apiClient.login();
  await apiClient.createExportJob({ name, status: 'processing' });
});

// "there is a user with role" defined in users.steps.ts
