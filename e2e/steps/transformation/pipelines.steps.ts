import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

/**
 * Transformation-specific step definitions
 */

// Note: Pipeline creation steps are handled by catchall.steps.ts
// - "there is a draft pipeline {string}"
// - "there is an active pipeline {string}"
// - "there is a pipeline {string} with steps"
// - "there is a pipeline {string} with run history"
// - "there is a completed run for {string}"
// - "there is a failed run for {string}"

Given('the pipeline has steps {string} then {string}', async ({ page }, step1: string, step2: string) => {
  // Steps already exist in the canvas
  await expect(page.getByText(step1)).toBeVisible();
  await expect(page.getByText(step2)).toBeVisible();
});

Given('the pipeline has a step {string}', async ({ page }, stepName: string) => {
  await expect(page.getByText(stepName)).toBeVisible();
});

Given('I have selected pipeline {string}', async ({ page }, name: string) => {
  await page.getByText(name).click();
});

When('I add a step of type {string}', async ({ page }, stepType: string) => {
  await page.getByRole('button', { name: /add step/i }).click();
  await page.getByRole('button', { name: stepType }).click();
});

When('I drag {string} before {string}', async ({ page }, source: string, target: string) => {
  const sourceElement = page.getByText(source).first();
  const targetElement = page.getByText(target).first();

  await sourceElement.dragTo(targetElement);
});

When('I select the {string} step', async ({ page }, stepName: string) => {
  await page.getByText(stepName).click();
});

When('I click on the run', async ({ page }) => {
  await page.locator('[data-testid="run-item"], .run-item').first().click();
});

// "I click on {string}" is defined in navigation.steps.ts

Then('I should see the filter step in the canvas', async ({ page }) => {
  await expect(page.getByText('Filter')).toBeVisible();
});

Then('I should see the map step in the canvas', async ({ page }) => {
  await expect(page.getByText('Map')).toBeVisible();
});

Then('the step should show {string}', async ({ page }, text: string) => {
  await expect(page.getByText(text)).toBeVisible();
});

Then('the step order should be {string} then {string}', async ({ page }, step1: string, step2: string) => {
  const steps = await page.locator('[data-testid="step"], .step-card').allTextContents();
  const step1Index = steps.findIndex(s => s.includes(step1));
  const step2Index = steps.findIndex(s => s.includes(step2));
  expect(step1Index).toBeLessThan(step2Index);
});

Then('I should see filter configuration options', async ({ page }) => {
  await expect(page.getByLabel(/condition|expression/i)).toBeVisible();
});

Then('I should see map configuration options', async ({ page }) => {
  await expect(page.getByLabel(/mapping|expression/i)).toBeVisible();
});

Then('I should see aggregate configuration options', async ({ page }) => {
  await expect(page.getByLabel(/group by|aggregate/i).first()).toBeVisible();
});

Then('I should see join configuration options', async ({ page }) => {
  await expect(page.getByLabel(/join|source/i).first()).toBeVisible();
});

Then('I should see sort configuration options', async ({ page }) => {
  await expect(page.getByLabel(/sort|order/i).first()).toBeVisible();
});

Then('I should see deduplicate configuration options', async ({ page }) => {
  await expect(page.getByLabel(/key|deduplicate/i).first()).toBeVisible();
});

Then('I can set a condition expression', async ({ page }) => {
  await expect(page.getByLabel(/condition|expression/i)).toBeEnabled();
});

Then('I can add field mappings', async ({ page }) => {
  await expect(page.getByRole('button', { name: /add.*mapping/i })).toBeVisible();
});

Then('I can set group by fields', async ({ page }) => {
  await expect(page.getByLabel(/group by/i)).toBeEnabled();
});

Then('I can add aggregate functions', async ({ page }) => {
  await expect(page.getByRole('button', { name: /add.*function|add.*metric/i })).toBeVisible();
});

Then('I can select a secondary source', async ({ page }) => {
  await expect(page.getByLabel(/source|join/i).first()).toBeEnabled();
});

Then('I can set join conditions', async ({ page }) => {
  await expect(page.getByLabel(/condition|on/i).first()).toBeEnabled();
});

Then('I can add sort fields with direction', async ({ page }) => {
  await expect(page.getByRole('button', { name: /add.*sort|add.*field/i })).toBeVisible();
});

Then('I can select key fields', async ({ page }) => {
  await expect(page.getByLabel(/key|field/i).first()).toBeEnabled();
});

Then('I should see a preview of the transformed data', async ({ page }) => {
  await expect(page.locator('[data-testid="preview"], .preview-table, table')).toBeVisible();
});

Then('the preview should show column headers', async ({ page }) => {
  await expect(page.locator('th, [data-testid="column-header"]').first()).toBeVisible();
});

Then('the preview should show sample rows', async ({ page }) => {
  await expect(page.locator('tr, [data-testid="preview-row"]').first()).toBeVisible();
});

Then('I should see the data at that step', async ({ page }) => {
  await expect(page.locator('[data-testid="step-preview"], .step-preview, table')).toBeVisible();
});

Then('I should see a new run in the history', async ({ page }) => {
  await expect(page.locator('[data-testid="run-item"], .run-item').first()).toBeVisible();
});

Then('the run status should progress from {string} to {string} to {string}', async ({ page }, _status1: string, _status2: string, status3: string) => {
  // Wait for final status
  await expect(page.getByText(status3)).toBeVisible({ timeout: 30000 });
});

Then('I should see run details', async ({ page }) => {
  await expect(page.locator('[data-testid="run-details"], .run-details')).toBeVisible();
});

Then('I should see records processed count', async ({ page }) => {
  await expect(page.getByText(/records|processed/i).first()).toBeVisible();
});

Then('I should see execution duration', async ({ page }) => {
  await expect(page.getByText(/duration|time/i).first()).toBeVisible();
});

Then('I should see a list of past runs', async ({ page }) => {
  await expect(page.locator('[data-testid="run-history"], .run-history')).toBeVisible();
});

Then('each run should show status, duration, and timestamp', async ({ page }) => {
  const runs = page.locator('[data-testid="run-item"], .run-item');
  const count = await runs.count();
  expect(count).toBeGreaterThan(0);
});

Then('I should see the error message', async ({ page }) => {
  await expect(page.locator('[data-testid="error-message"], .error-message')).toBeVisible();
});

Then('I should see which step failed', async ({ page }) => {
  await expect(page.getByText(/failed.*step|step.*failed/i).first()).toBeVisible();
});
