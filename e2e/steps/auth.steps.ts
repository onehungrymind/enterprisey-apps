import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';

Given('I am on the login page', async ({ page }) => {
  await page.goto('/users/login');
});

When('I enter email {string}', async ({ page }, email: string) => {
  await page.getByLabel('Email').fill(email);
});

When('I enter password {string}', async ({ page }, password: string) => {
  await page.getByLabel('Password').fill(password);
});

When('I submit the login form', async ({ page }) => {
  await page.getByRole('button', { name: /login|sign in/i }).click();
});

Then('I should be redirected to the dashboard', async ({ page }) => {
  await expect(page).toHaveURL('/');
});
