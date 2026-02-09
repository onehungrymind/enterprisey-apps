import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from '../support/selectors';
import { PAGES } from '../support/test-data';

/**
 * Portal page object for health monitoring and navigation
 */
export class PortalPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to portal app
   */
  async goto(): Promise<void> {
    await this.page.goto(PAGES.portal);
    await this.waitForLoadState();
  }

  /**
   * Verify health grid is visible
   */
  async expectHealthGridVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.portal.healthGrid)).toBeVisible();
  }

  /**
   * Click refresh button
   */
  async clickRefresh(): Promise<void> {
    await this.page.locator(SELECTORS.portal.refreshButton).click();
  }

  /**
   * Verify service status
   */
  async expectServiceStatus(serviceName: string, status: 'healthy' | 'unhealthy'): Promise<void> {
    const serviceCard = this.page.locator(SELECTORS.portal.serviceCard(serviceName));
    await expect(serviceCard).toBeVisible();
    // Check for status indicator class
    const indicator = serviceCard.locator(SELECTORS.portal.statusIndicator);
    if (status === 'healthy') {
      await expect(indicator).toHaveClass(/green|success|healthy/);
    } else {
      await expect(indicator).toHaveClass(/red|error|unhealthy/);
    }
  }

  /**
   * Click feature card to navigate
   */
  async clickFeatureCard(featureName: string): Promise<void> {
    await this.page.locator(SELECTORS.portal.featureCard(featureName)).click();
  }

  /**
   * Verify all services are displayed
   */
  async expectAllServicesDisplayed(): Promise<void> {
    const services = ['Ingress', 'Transformation', 'Reporting', 'Export', 'Users', 'Features'];
    for (const service of services) {
      await expect(this.page.locator(SELECTORS.portal.serviceCard(service))).toBeVisible();
    }
  }

  /**
   * Navigate to ingress via feature card
   */
  async navigateToIngress(): Promise<void> {
    await this.clickFeatureCard('Ingress');
    await this.page.waitForURL(/4201/);
  }

  /**
   * Navigate to transformation via feature card
   */
  async navigateToTransformation(): Promise<void> {
    await this.clickFeatureCard('Transformation');
    await this.page.waitForURL(/4202/);
  }

  /**
   * Navigate to reporting via feature card
   */
  async navigateToReporting(): Promise<void> {
    await this.clickFeatureCard('Reporting');
    await this.page.waitForURL(/4203/);
  }

  /**
   * Navigate to export via feature card
   */
  async navigateToExport(): Promise<void> {
    await this.clickFeatureCard('Export');
    await this.page.waitForURL(/4204/);
  }
}
