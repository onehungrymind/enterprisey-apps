import { test as base, createBdd } from 'playwright-bdd';
import { ApiClient } from '../support/api-client';
import {
  LoginPage,
  IngressPage,
  TransformationPage,
  ReportingPage,
  ExportPage,
  UsersPage,
  PortalPage,
} from '../pages';

/**
 * Custom fixtures for E2E tests
 */
type CustomFixtures = {
  apiClient: ApiClient;
  loginPage: LoginPage;
  ingressPage: IngressPage;
  transformationPage: TransformationPage;
  reportingPage: ReportingPage;
  exportPage: ExportPage;
  usersPage: UsersPage;
  portalPage: PortalPage;
};

export const test = base.extend<CustomFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use(client);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  ingressPage: async ({ page }, use) => {
    const ingressPage = new IngressPage(page);
    await use(ingressPage);
  },

  transformationPage: async ({ page }, use) => {
    const transformationPage = new TransformationPage(page);
    await use(transformationPage);
  },

  reportingPage: async ({ page }, use) => {
    const reportingPage = new ReportingPage(page);
    await use(reportingPage);
  },

  exportPage: async ({ page }, use) => {
    const exportPage = new ExportPage(page);
    await use(exportPage);
  },

  usersPage: async ({ page }, use) => {
    const usersPage = new UsersPage(page);
    await use(usersPage);
  },

  portalPage: async ({ page }, use) => {
    const portalPage = new PortalPage(page);
    await use(portalPage);
  },
});

export const { Given, When, Then } = createBdd(test);
