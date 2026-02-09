import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from '../support/selectors';
import { TEST_USERS, PAGES } from '../support/test-data';

/**
 * Login page object
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    // Navigate to users app login
    await this.page.goto(`${PAGES.users}/login`);
    await this.waitForLoadState();
  }

  /**
   * Fill email field
   */
  async enterEmail(email: string): Promise<void> {
    await this.page.locator(SELECTORS.login.emailInput).fill(email);
  }

  /**
   * Fill password field
   */
  async enterPassword(password: string): Promise<void> {
    await this.page.locator(SELECTORS.login.passwordInput).fill(password);
  }

  /**
   * Click sign in button
   */
  async clickSignIn(): Promise<void> {
    await this.page.locator(SELECTORS.login.submitButton).click();
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSignIn();
  }

  /**
   * Login as admin user
   */
  async loginAsAdmin(): Promise<void> {
    await this.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
  }

  /**
   * Login as regular user
   */
  async loginAsUser(): Promise<void> {
    await this.login(TEST_USERS.user.email, TEST_USERS.user.password);
  }

  /**
   * Verify login error is displayed
   */
  async expectLoginError(message?: string): Promise<void> {
    const errorLocator = this.page.locator(SELECTORS.login.errorMessage);
    await expect(errorLocator).toBeVisible();
    if (message) {
      await expect(errorLocator).toContainText(message);
    }
  }

  /**
   * Verify still on login page
   */
  async expectOnLoginPage(): Promise<void> {
    await expect(this.page.locator(SELECTORS.login.submitButton)).toBeVisible();
  }

  /**
   * Verify redirected to dashboard
   */
  async expectRedirectedToDashboard(): Promise<void> {
    await this.page.waitForURL(/.*(?:dashboard|portal|\/)/);
  }

  /**
   * Check if user menu is visible (indicating logged in)
   */
  async expectUserMenuVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.header.userMenu)).toBeVisible();
  }
}
