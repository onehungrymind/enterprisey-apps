import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

/**
 * Export-specific step definitions
 */

Given('there is a running job {string}', async ({ apiClient }, name: string) => {
  await apiClient.login();
  await apiClient.createExportJob({
    name,
    format: 'csv',
    status: 'processing',
  });
});

Given('there is a completed job {string}', async ({ apiClient }, name: string) => {
  await apiClient.login();
  await apiClient.createExportJob({
    name,
    format: 'csv',
    status: 'completed',
    completedAt: new Date().toISOString(),
  });
});

Given('there is a job that will fail', async ({ apiClient }) => {
  await apiClient.login();
  await apiClient.createExportJob({
    name: 'Failing Job',
    format: 'csv',
    status: 'queued',
  });
});

When('I create an export job with format {string}', async ({ page }, format: string) => {
  await page.getByRole('button', { name: /new export/i }).click();
  await page.getByLabel(/name/i).fill('Test Export');
  await page.getByLabel(/format/i).selectOption(format);
  await page.getByRole('button', { name: /submit|create/i }).click();
});

When('the job completes', async ({ page }) => {
  await expect(page.getByText(/completed/i)).toBeVisible({ timeout: 30000 });
});

When('the job fails', async ({ page }) => {
  await expect(page.getByText(/failed/i)).toBeVisible({ timeout: 30000 });
});

When('I click cancel on {string}', async ({ page }, jobName: string) => {
  const jobCard = page.locator(`[data-testid="job-${jobName}"], .job-card:has-text("${jobName}")`);
  await jobCard.getByRole('button', { name: /cancel/i }).click();
});

When('I click download on {string}', async ({ page }, jobName: string) => {
  const jobCard = page.locator(`[data-testid="job-${jobName}"], .job-card:has-text("${jobName}")`);
  await jobCard.getByRole('button', { name: /download/i }).click();
});

Then('I should see active jobs section', async ({ page }) => {
  await expect(page.locator('[data-testid="active-jobs"], .active-jobs').first()).toBeVisible();
});

Then('I should see job history section', async ({ page }) => {
  await expect(page.locator('[data-testid="job-history"], .job-history').first()).toBeVisible();
});

Then('I should see {string} in active jobs', async ({ page }, jobName: string) => {
  await expect(page.locator(`[data-testid="active-jobs"] :text("${jobName}")`)).toBeVisible();
});

Then('the job status should be {string} or {string}', async ({ page }, status1: string, status2: string) => {
  const statusLocator = page.getByText(new RegExp(`${status1}|${status2}`, 'i')).first();
  await expect(statusLocator).toBeVisible();
});

Then('the status should be {string}', async ({ page }, status: string) => {
  await expect(page.getByText(status)).toBeVisible();
});

Then('the job status should be {string}', async ({ page }, status: string) => {
  await expect(page.getByText(status)).toBeVisible();
});

Then('the job should move to history', async ({ page }) => {
  await expect(page.locator('[data-testid="job-history"], .job-history').first()).toBeVisible();
});

Then('the output file should be a CSV', async ({ page }) => {
  await expect(page.getByText(/\.csv/i)).toBeVisible();
});

Then('the output file should be JSON', async ({ page }) => {
  await expect(page.getByText(/\.json/i)).toBeVisible();
});
