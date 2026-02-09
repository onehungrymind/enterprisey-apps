import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';
import { TEST_USERS, PAGES } from '../../support/test-data';

/**
 * Authentication step definitions
 */

// "I am on the login page" is now handled by navigation.steps.ts
// This comment preserved for reference

Given('I am logged in as {string}', async ({ loginPage, page }, email: string) => {
  await loginPage.goto();

  // Find user by email or use provided email
  const user = Object.values(TEST_USERS).find((u) => u.email === email);
  const password = user?.password || 'password123';

  await loginPage.login(email, password);
  await loginPage.waitForLoadState();
});

Given('I am logged in as admin', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.loginAsAdmin();
  await loginPage.waitForLoadState();
});

Given('I am logged in as a regular user', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.loginAsUser();
  await loginPage.waitForLoadState();
});

When('I enter email {string}', async ({ loginPage }, email: string) => {
  await loginPage.enterEmail(email);
});

When('I enter password {string}', async ({ loginPage }, password: string) => {
  await loginPage.enterPassword(password);
});

When('I click the sign in button', async ({ loginPage }) => {
  await loginPage.clickSignIn();
});

When('I submit the login form', async ({ loginPage }) => {
  await loginPage.clickSignIn();
});

When('I click the user menu', async ({ page }) => {
  await page.locator('[data-testid="user-menu"], .user-menu').click();
});

When('I click logout', async ({ page }) => {
  await page.getByRole('button', { name: /logout|sign out/i }).click();
});

Then('I should be redirected to the dashboard', async ({ loginPage }) => {
  await loginPage.expectRedirectedToDashboard();
});

Then('I should be redirected to the login page', async ({ page }) => {
  await expect(page).toHaveURL(/login/);
});

Then('I should see the user menu', async ({ loginPage }) => {
  await loginPage.expectUserMenuVisible();
});

Then('I should see an error message {string}', async ({ page }, message: string) => {
  await expect(page.getByText(message)).toBeVisible();
});

Then('I should see an error message', async ({ loginPage }) => {
  await loginPage.expectLoginError();
});

Then('I should remain on the login page', async ({ loginPage }) => {
  await loginPage.expectOnLoginPage();
});

Then('I should see validation errors', async ({ page }) => {
  // Look for any validation error indicators
  const hasErrors = await page.locator('.error, [aria-invalid="true"], .invalid-feedback').first().isVisible();
  expect(hasErrors).toBe(true);
});

Then('I should not see the admin menu', async ({ page }) => {
  await expect(page.locator('[data-testid="admin-menu"]')).not.toBeVisible();
});

Then('I should have access to user management', async ({ page }) => {
  await expect(page.getByText(/user management|users/i).first()).toBeVisible();
});

Then('I should have access to company management', async ({ page }) => {
  await expect(page.getByText(/company|companies/i).first()).toBeVisible();
});
