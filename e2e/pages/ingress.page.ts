import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from '../support/selectors';
import { PAGES } from '../support/test-data';

/**
 * Ingress page object for data source management
 */
export class IngressPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to ingress app
   */
  async goto(): Promise<void> {
    await this.page.goto(PAGES.ingress);
    await this.waitForLoadState();
  }

  /**
   * Verify sources list is visible
   */
  async expectSourcesListVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.ingress.sourceList)).toBeVisible();
  }

  /**
   * Click new data source button
   */
  async clickNewDataSource(): Promise<void> {
    await this.page.locator(SELECTORS.ingress.newSourceButton).click();
  }

  /**
   * Select a source by name
   */
  async selectSource(name: string): Promise<void> {
    await this.page.locator(SELECTORS.ingress.sourceCard(name)).click();
  }

  /**
   * Verify source is in list
   */
  async expectSourceInList(name: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.ingress.sourceCard(name))).toBeVisible();
  }

  /**
   * Verify source is not in list
   */
  async expectSourceNotInList(name: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.ingress.sourceCard(name))).not.toBeVisible();
  }

  /**
   * Click test connection button
   */
  async clickTestConnection(): Promise<void> {
    await this.page.locator(SELECTORS.ingress.testConnectionButton).click();
  }

  /**
   * Click sync button
   */
  async clickSync(): Promise<void> {
    await this.page.locator(SELECTORS.ingress.syncButton).click();
  }

  /**
   * Get source status
   */
  async getSourceStatus(): Promise<string> {
    const badge = this.page.locator(SELECTORS.ingress.statusBadge);
    return await badge.textContent() || '';
  }

  /**
   * Wait for status to change
   */
  async waitForStatus(status: string, timeout: number = 10000): Promise<void> {
    await this.waitFor(async () => {
      const currentStatus = await this.getSourceStatus();
      return currentStatus.toLowerCase().includes(status.toLowerCase());
    }, timeout);
  }

  /**
   * Fill source form for database type
   */
  async fillDatabaseSource(data: {
    name: string;
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
  }): Promise<void> {
    await this.fillField('Name', data.name);
    await this.fillField('Host', data.host);
    await this.fillField('Port', data.port);
    await this.fillField('Database', data.database);
    await this.fillField('Username', data.username);
    await this.fillField('Password', data.password);
  }

  /**
   * Select source type
   */
  async selectSourceType(type: string): Promise<void> {
    await this.page.getByRole('button', { name: type }).click();
  }
}
