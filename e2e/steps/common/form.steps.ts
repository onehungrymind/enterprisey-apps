import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

/**
 * Form interaction step definitions
 */

When('I fill in {word} {string}', async ({ page }, fieldName: string, value: string) => {
  // Try different ways to find the input
  const byLabel = page.getByLabel(fieldName, { exact: false });
  if (await byLabel.isVisible()) {
    await byLabel.fill(value);
    return;
  }

  const byPlaceholder = page.getByPlaceholder(fieldName);
  if (await byPlaceholder.isVisible()) {
    await byPlaceholder.fill(value);
    return;
  }

  // Fallback to CSS selectors
  const input = page.locator(`input[name="${fieldName}"], input[id="${fieldName}"], textarea[name="${fieldName}"]`);
  await input.fill(value);
});

When('I fill in the {string} field with {string}', async ({ page }, fieldLabel: string, value: string) => {
  await page.getByLabel(fieldLabel).fill(value);
});

When('I select {word} {string}', async ({ page }, fieldName: string, value: string) => {
  const select = page.getByLabel(fieldName, { exact: false });
  if (await select.isVisible()) {
    await select.selectOption(value);
    return;
  }

  // Fallback
  await page.locator(`select[name="${fieldName}"], select[id="${fieldName}"]`).selectOption(value);
});

When('I select source type {string}', async ({ page }, sourceType: string) => {
  await page.getByRole('button', { name: sourceType }).click();
});

When('I select step type {string}', async ({ page }, stepType: string) => {
  await page.getByRole('button', { name: stepType }).click();
});

// "I select format" is handled by "I select {word} {string}" above

When('I check {string}', async ({ page }, label: string) => {
  await page.getByLabel(label).check();
});

When('I uncheck {string}', async ({ page }, label: string) => {
  await page.getByLabel(label).uncheck();
});

When('I click save', async ({ page }) => {
  await page.getByRole('button', { name: /save/i }).click();
});

When('I click submit', async ({ page }) => {
  await page.getByRole('button', { name: /submit/i }).click();
});

When('I click create', async ({ page }) => {
  await page.getByRole('button', { name: /create/i }).click();
});

When('I click cancel', async ({ page }) => {
  await page.getByRole('button', { name: /cancel/i }).click();
});

When('I click save step', async ({ page }) => {
  await page.getByRole('button', { name: /save|add|confirm/i }).click();
});

When('I click send invite', async ({ page }) => {
  await page.getByRole('button', { name: /send invite|invite/i }).click();
});

When('I click configure', async ({ page }) => {
  await page.getByRole('button', { name: /configure|edit/i }).click();
});

When('I click delete', async ({ page }) => {
  await page.getByRole('button', { name: /delete/i }).click();
});

When('I click delete step', async ({ page }) => {
  await page.getByRole('button', { name: /delete|remove/i }).click();
});

When('I change the name to {string}', async ({ page }, newName: string) => {
  const nameInput = page.getByLabel(/name/i).first();
  await nameInput.clear();
  await nameInput.fill(newName);
});

When('I change the description to {string}', async ({ page }, newDescription: string) => {
  const descInput = page.getByLabel(/description/i);
  await descInput.clear();
  await descInput.fill(newDescription);
});

When('I change role to {string}', async ({ page }, role: string) => {
  await page.getByLabel(/role/i).selectOption(role);
});

When('I change the status to {string}', async ({ page }, status: string) => {
  await page.getByLabel(/status/i).selectOption(status);
});

When('I configure the filter condition {string}', async ({ page }, condition: string) => {
  await page.getByLabel(/condition|expression|filter/i).fill(condition);
});

When('I configure the mapping expression {string}', async ({ page }, expression: string) => {
  await page.getByLabel(/expression|mapping/i).fill(expression);
});

// Use field-specific assertions in domain step files to avoid conflicts

// Removed - too generic, conflicts with domain-specific steps like "the job status should be..."
// Use specific assertions in domain step files instead
