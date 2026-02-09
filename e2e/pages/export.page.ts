import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from '../support/selectors';
import { PAGES } from '../support/test-data';

/**
 * Export page object for job management
 */
export class ExportPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to export app
   */
  async goto(): Promise<void> {
    await this.page.goto(PAGES.export);
    await this.waitForLoadState();
  }

  /**
   * Verify active jobs section is visible
   */
  async expectActiveJobsVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.export.activeJobs)).toBeVisible();
  }

  /**
   * Verify job history section is visible
   */
  async expectJobHistoryVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.export.jobHistory)).toBeVisible();
  }

  /**
   * Click new export job button
   */
  async clickNewExportJob(): Promise<void> {
    await this.page.locator(SELECTORS.export.newJobButton).click();
  }

  /**
   * Select a job by name
   */
  async selectJob(name: string): Promise<void> {
    await this.page.locator(SELECTORS.export.jobCard(name)).click();
  }

  /**
   * Verify job is in active jobs
   */
  async expectJobInActiveJobs(name: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.export.jobCard(name))).toBeVisible();
  }

  /**
   * Click download button for a job
   */
  async clickDownload(jobName: string): Promise<void> {
    const jobCard = this.page.locator(SELECTORS.export.jobCard(jobName));
    await jobCard.locator(SELECTORS.export.downloadButton).click();
  }

  /**
   * Click cancel button for a job
   */
  async clickCancel(jobName: string): Promise<void> {
    const jobCard = this.page.locator(SELECTORS.export.jobCard(jobName));
    await jobCard.locator(SELECTORS.export.cancelButton).click();
  }

  /**
   * Verify progress bar is visible
   */
  async expectProgressBarVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.export.progressBar).first()).toBeVisible();
  }

  /**
   * Fill export job form
   */
  async fillJobForm(data: {
    name: string;
    format?: string;
  }): Promise<void> {
    await this.fillField('Name', data.name);
    if (data.format) {
      await this.selectOption('Format', data.format);
    }
  }
}
