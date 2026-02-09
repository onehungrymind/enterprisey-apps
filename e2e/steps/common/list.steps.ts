import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

/**
 * List interaction step definitions
 */

Then('I should see the {word} list', async ({ page }, listName: string) => {
  const selectors = [
    `[data-testid="${listName}-list"]`,
    `.${listName}-list`,
    `[data-testid="list"]`,
    '.list',
    'ul',
    'table',
  ];

  let found = false;
  for (const selector of selectors) {
    const element = page.locator(selector).first();
    if (await element.isVisible()) {
      found = true;
      break;
    }
  }

  expect(found).toBe(true);
});

Then('I should see {string} in the {word} list', async ({ page }, itemName: string, listName: string) => {
  const listLocator = page.locator(`[data-testid="${listName}-list"], .${listName}-list, ul, table`).first();
  await expect(listLocator.getByText(itemName)).toBeVisible();
});

Then('I should not see {string} in the {word} list', async ({ page }, itemName: string, listName: string) => {
  const listLocator = page.locator(`[data-testid="${listName}-list"], .${listName}-list, ul, table`).first();
  await expect(listLocator.getByText(itemName)).not.toBeVisible();
});

When('I select {string}', async ({ page }, itemName: string) => {
  await page.getByText(itemName, { exact: false }).first().click();
});

Then('each {word} should show {string}', async ({ page }, itemType: string, expectedFields: string) => {
  const fields = expectedFields.split(',').map(f => f.trim());
  const items = page.locator(`[data-testid="${itemType}"], .${itemType}-card, .${itemType}-item`);
  const count = await items.count();

  expect(count).toBeGreaterThan(0);

  // Check first item has the expected field labels
  const firstItem = items.first();
  for (const field of fields) {
    await expect(firstItem.getByText(new RegExp(field, 'i'))).toBeVisible();
  }
});

Given('there is a {word} named {string}', async ({ apiClient }, entityType: string, name: string) => {
  // Create the entity via API
  await apiClient.login();

  switch (entityType.toLowerCase()) {
    case 'source':
      await apiClient.createSource({ name, type: 'database' });
      break;
    case 'pipeline':
      await apiClient.createPipeline({ name, status: 'draft' });
      break;
    case 'dashboard':
      await apiClient.createDashboard({ name });
      break;
    case 'job':
      await apiClient.createExportJob({ name, format: 'csv' });
      break;
    case 'user':
      await apiClient.createUser({ firstName: name.split(' ')[0], lastName: name.split(' ')[1] || '', email: `${name.toLowerCase().replace(' ', '.')}@example.com` });
      break;
    case 'company':
      await apiClient.createCompany({ name });
      break;
  }
});

Given('there are {word} {string} and {string}', async ({ apiClient }, entityType: string, name1: string, name2: string) => {
  await apiClient.login();

  const createEntity = async (name: string) => {
    switch (entityType.toLowerCase()) {
      case 'dashboards':
        await apiClient.createDashboard({ name });
        break;
      case 'sources':
        await apiClient.createSource({ name, type: 'database' });
        break;
      case 'pipelines':
        await apiClient.createPipeline({ name, status: 'draft' });
        break;
    }
  };

  await createEntity(name1);
  await createEntity(name2);
});
