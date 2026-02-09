import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';
import { PAGES } from '../../support/test-data';

/**
 * Navigation step definitions
 */

const PAGE_URLS: Record<string, string> = {
  portal: PAGES.portal,
  dashboard: PAGES.dashboard,
  ingress: PAGES.ingress,
  transformation: PAGES.transformation,
  reporting: PAGES.reporting,
  export: PAGES.export,
  users: PAGES.users,
};

// Note: "login" page has specific handling in auth.steps.ts
Given('I am on the {word} page', async ({ page, loginPage }, pageName: string) => {
  // Handle login page specially using loginPage object
  if (pageName.toLowerCase() === 'login') {
    await loginPage.goto();
    return;
  }

  const url = PAGE_URLS[pageName.toLowerCase()];
  if (url) {
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded');
  } else {
    throw new Error(`Unknown page: ${pageName}`);
  }
});

When('I navigate to the {word} page', async ({ page }, pageName: string) => {
  const url = PAGE_URLS[pageName.toLowerCase()];
  if (url) {
    await page.goto(url);
    await page.waitForLoadState('domcontentloaded');
  } else {
    throw new Error(`Unknown page: ${pageName}`);
  }
});

When('I click on {string}', async ({ page }, text: string) => {
  await page.getByText(text, { exact: false }).first().click();
});

When('I click the {string} button', async ({ page }, buttonText: string) => {
  await page.getByRole('button', { name: buttonText }).click();
});

When('I click the {string} link', async ({ page }, linkText: string) => {
  await page.getByRole('link', { name: linkText }).click();
});

When('I click on the {word} feature card', async ({ page }, featureName: string) => {
  await page.locator(`[data-testid="feature-${featureName}"], .feature-card:has-text("${featureName}")`).click();
});

Then('I should be on the {word} page', async ({ page }, pageName: string) => {
  const patterns: Record<string, RegExp> = {
    portal: /localhost:4200/,
    dashboard: /localhost:4200/,
    ingress: /localhost:4201/,
    transformation: /localhost:4202/,
    reporting: /localhost:4203/,
    export: /localhost:4204/,
    users: /localhost:4205/,
    login: /login/,
  };

  const pattern = patterns[pageName.toLowerCase()];
  if (pattern) {
    await expect(page).toHaveURL(pattern);
  } else {
    throw new Error(`Unknown page pattern: ${pageName}`);
  }
});

Then('the page title should contain {string}', async ({ page }, title: string) => {
  await expect(page).toHaveTitle(new RegExp(title, 'i'));
});
