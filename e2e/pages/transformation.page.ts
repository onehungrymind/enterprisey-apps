import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from '../support/selectors';
import { PAGES } from '../support/test-data';

/**
 * Transformation page object for pipeline management
 */
export class TransformationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to transformation app
   */
  async goto(): Promise<void> {
    await this.page.goto(PAGES.transformation);
    await this.waitForLoadState();
  }

  /**
   * Verify pipelines list is visible
   */
  async expectPipelinesListVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.transformation.pipelineList)).toBeVisible();
  }

  /**
   * Click new pipeline button
   */
  async clickNewPipeline(): Promise<void> {
    await this.page.locator(SELECTORS.transformation.newPipelineButton).click();
  }

  /**
   * Select a pipeline by name
   */
  async selectPipeline(name: string): Promise<void> {
    await this.page.locator(SELECTORS.transformation.pipelineCard(name)).click();
  }

  /**
   * Verify pipeline is in list
   */
  async expectPipelineInList(name: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.transformation.pipelineCard(name))).toBeVisible();
  }

  /**
   * Verify pipeline is not in list
   */
  async expectPipelineNotInList(name: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.transformation.pipelineCard(name))).not.toBeVisible();
  }

  /**
   * Click add step button
   */
  async clickAddStep(): Promise<void> {
    await this.page.locator(SELECTORS.transformation.addStepButton).click();
  }

  /**
   * Click run button
   */
  async clickRun(): Promise<void> {
    await this.page.locator(SELECTORS.transformation.runButton).click();
  }

  /**
   * Click preview button
   */
  async clickPreview(): Promise<void> {
    await this.page.locator(SELECTORS.transformation.previewButton).click();
  }

  /**
   * Verify step canvas is visible
   */
  async expectCanvasVisible(): Promise<void> {
    await expect(this.page.locator(SELECTORS.transformation.stepCanvas)).toBeVisible();
  }

  /**
   * Verify step is in canvas
   */
  async expectStepInCanvas(name: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.transformation.stepCard(name))).toBeVisible();
  }

  /**
   * Select a step by name
   */
  async selectStep(name: string): Promise<void> {
    await this.page.locator(SELECTORS.transformation.stepCard(name)).click();
  }

  /**
   * Select step type
   */
  async selectStepType(type: string): Promise<void> {
    await this.page.getByRole('button', { name: type }).click();
  }

  /**
   * Fill pipeline form
   */
  async fillPipelineForm(data: {
    name: string;
    description?: string;
  }): Promise<void> {
    await this.fillField('Name', data.name);
    if (data.description) {
      await this.fillField('Description', data.description);
    }
  }
}
