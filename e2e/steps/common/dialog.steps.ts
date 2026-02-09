import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

/**
 * Dialog/Modal step definitions
 */

When('I confirm the deletion', async ({ page }) => {
  await page.getByRole('button', { name: /confirm|yes|delete|ok/i }).click();
});

When('I cancel the dialog', async ({ page }) => {
  await page.getByRole('button', { name: /cancel|no/i }).click();
});

When('I close the dialog', async ({ page }) => {
  const closeButton = page.locator('[data-testid="modal-close"], .close-btn, button:has-text("Close")');
  if (await closeButton.isVisible()) {
    await closeButton.click();
    return;
  }

  // Try clicking outside the dialog
  await page.locator('.overlay, .backdrop').click({ position: { x: 10, y: 10 } });
});

Then('I should see a dialog', async ({ page }) => {
  await expect(page.locator('[role="dialog"], .dialog, .modal')).toBeVisible();
});

Then('I should not see a dialog', async ({ page }) => {
  await expect(page.locator('[role="dialog"], .dialog, .modal')).not.toBeVisible();
});

Then('the dialog should have title {string}', async ({ page }, title: string) => {
  const dialog = page.locator('[role="dialog"], .dialog, .modal');
  await expect(dialog.getByRole('heading').first()).toContainText(title);
});
