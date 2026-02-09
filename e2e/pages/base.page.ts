import { Page, Locator, expect } from '@playwright/test';
import { SELECTORS } from '../support/selectors';
import { TIMEOUTS } from '../support/test-data';

/**
 * Base page object with common functionality
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a URL
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForLoadState();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForLoadState(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for loading spinner to disappear
   */
  async waitForLoading(): Promise<void> {
    const spinner = this.page.locator(SELECTORS.common.loadingSpinner);
    if (await spinner.isVisible()) {
      await spinner.waitFor({ state: 'hidden', timeout: TIMEOUTS.long });
    }
  }

  /**
   * Fill a form field by label
   */
  async fillField(label: string, value: string): Promise<void> {
    const input = this.page.getByLabel(label);
    if (await input.isVisible()) {
      await input.fill(value);
      return;
    }

    // Fallback to placeholder
    const byPlaceholder = this.page.getByPlaceholder(label);
    if (await byPlaceholder.isVisible()) {
      await byPlaceholder.fill(value);
      return;
    }

    // Fallback to selector
    await this.page.locator(SELECTORS.form.field(label)).fill(value);
  }

  /**
   * Select an option from a dropdown
   */
  async selectOption(label: string, value: string): Promise<void> {
    const select = this.page.getByLabel(label);
    if (await select.isVisible()) {
      await select.selectOption(value);
      return;
    }

    await this.page.locator(SELECTORS.form.select(label)).selectOption(value);
  }

  /**
   * Click a button by text
   */
  async clickButton(text: string): Promise<void> {
    await this.page.getByRole('button', { name: text }).click();
  }

  /**
   * Click a link by text
   */
  async clickLink(text: string): Promise<void> {
    await this.page.getByRole('link', { name: text }).click();
  }

  /**
   * Check a checkbox by label
   */
  async checkCheckbox(label: string): Promise<void> {
    const checkbox = this.page.getByLabel(label);
    if (await checkbox.isVisible()) {
      await checkbox.check();
      return;
    }
    await this.page.locator(SELECTORS.form.checkbox(label)).check();
  }

  /**
   * Uncheck a checkbox by label
   */
  async uncheckCheckbox(label: string): Promise<void> {
    const checkbox = this.page.getByLabel(label);
    if (await checkbox.isVisible()) {
      await checkbox.uncheck();
      return;
    }
    await this.page.locator(SELECTORS.form.checkbox(label)).uncheck();
  }

  /**
   * Verify text is visible on page
   */
  async expectVisible(text: string): Promise<void> {
    await expect(this.page.getByText(text).first()).toBeVisible();
  }

  /**
   * Verify text is not visible on page
   */
  async expectNotVisible(text: string): Promise<void> {
    await expect(this.page.getByText(text)).not.toBeVisible();
  }

  /**
   * Verify element is visible
   */
  async expectElementVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector).first()).toBeVisible();
  }

  /**
   * Verify element is not visible
   */
  async expectElementNotVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).not.toBeVisible();
  }

  /**
   * Wait for a condition with timeout
   */
  async waitFor(condition: () => Promise<boolean>, timeout: number = TIMEOUTS.medium): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await condition()) {
        return;
      }
      await this.page.waitForTimeout(100);
    }
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  /**
   * Verify URL contains path
   */
  async expectUrl(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Confirm a dialog
   */
  async confirmDialog(): Promise<void> {
    await this.page.locator(SELECTORS.common.confirmButton).click();
  }

  /**
   * Cancel a dialog
   */
  async cancelDialog(): Promise<void> {
    await this.page.locator(SELECTORS.common.cancelButton).click();
  }

  /**
   * Close a modal
   */
  async closeModal(): Promise<void> {
    await this.page.locator(SELECTORS.common.modalClose).click();
  }

  /**
   * Click save button
   */
  async clickSave(): Promise<void> {
    await this.page.locator(SELECTORS.common.saveButton).click();
  }

  /**
   * Click delete button
   */
  async clickDelete(): Promise<void> {
    await this.page.locator(SELECTORS.common.deleteButton).click();
  }

  /**
   * Click edit button
   */
  async clickEdit(): Promise<void> {
    await this.page.locator(SELECTORS.common.editButton).click();
  }
}
