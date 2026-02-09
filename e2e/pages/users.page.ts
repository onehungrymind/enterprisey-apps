import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from '../support/selectors';
import { PAGES } from '../support/test-data';

/**
 * Users page object for user and company management
 */
export class UsersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to users app
   */
  async goto(): Promise<void> {
    await this.page.goto(PAGES.users);
    await this.waitForLoadState();
  }

  /**
   * Verify users list is visible
   */
  async expectUsersListVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.users.userList)).toBeVisible();
  }

  /**
   * Click invite user button
   */
  async clickInviteUser(): Promise<void> {
    await this.page.locator(SELECTORS.users.inviteButton).click();
  }

  /**
   * Select a user by name
   */
  async selectUser(name: string): Promise<void> {
    await this.page.locator(SELECTORS.users.userRow(name)).click();
  }

  /**
   * Verify user is in list
   */
  async expectUserInList(name: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.users.userRow(name))).toBeVisible();
  }

  /**
   * Verify user is not in list
   */
  async expectUserNotInList(name: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.users.userRow(name))).not.toBeVisible();
  }

  /**
   * Click companies tab
   */
  async clickCompaniesTab(): Promise<void> {
    await this.page.locator(SELECTORS.users.companyTab).click();
  }

  /**
   * Verify companies list is visible
   */
  async expectCompaniesListVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.users.companyList)).toBeVisible();
  }

  /**
   * Click add company button
   */
  async clickAddCompany(): Promise<void> {
    await this.page.locator(SELECTORS.users.addCompanyButton).click();
  }

  /**
   * Select a company by name
   */
  async selectCompany(name: string): Promise<void> {
    await this.page.locator(SELECTORS.users.companyRow(name)).click();
  }

  /**
   * Verify company is in list
   */
  async expectCompanyInList(name: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.users.companyRow(name))).toBeVisible();
  }

  /**
   * Fill user invite form
   */
  async fillUserInviteForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    company?: string;
  }): Promise<void> {
    await this.fillField('First Name', data.firstName);
    await this.fillField('Last Name', data.lastName);
    await this.fillField('Email', data.email);
    if (data.role) {
      await this.selectOption('Role', data.role);
    }
    if (data.company) {
      await this.selectOption('Company', data.company);
    }
  }

  /**
   * Fill company form
   */
  async fillCompanyForm(data: {
    name: string;
  }): Promise<void> {
    await this.fillField('Name', data.name);
  }
}
