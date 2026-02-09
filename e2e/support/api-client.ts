import { APIRequestContext } from '@playwright/test';
import { API_URLS, TEST_USERS } from './test-data';

/**
 * API client for test setup and teardown operations
 */
export class ApiClient {
  private token: string | null = null;

  constructor(private request: APIRequestContext) {}

  /**
   * Authenticate and get a token
   */
  async login(
    email: string = TEST_USERS.admin.email,
    password: string = TEST_USERS.admin.password
  ): Promise<string> {
    const response = await this.request.post(`${API_URLS.users}/auth/login`, {
      data: { email, password },
    });
    const data = await response.json();
    this.token = data.token || data.access_token;
    return this.token!;
  }

  private getHeaders() {
    return this.token
      ? { Authorization: `Bearer ${this.token}` }
      : {};
  }

  // --- Sources ---

  async createSource(source: Record<string, unknown>) {
    const response = await this.request.post(`${API_URLS.ingress}/sources`, {
      data: source,
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async deleteSource(id: string) {
    await this.request.delete(`${API_URLS.ingress}/sources/${id}`, {
      headers: this.getHeaders(),
    });
  }

  async getSources() {
    const response = await this.request.get(`${API_URLS.ingress}/sources`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // --- Pipelines ---

  async createPipeline(pipeline: Record<string, unknown>) {
    const response = await this.request.post(`${API_URLS.transformation}/pipelines`, {
      data: pipeline,
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async deletePipeline(id: string) {
    await this.request.delete(`${API_URLS.transformation}/pipelines/${id}`, {
      headers: this.getHeaders(),
    });
  }

  async getPipelines() {
    const response = await this.request.get(`${API_URLS.transformation}/pipelines`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // --- Dashboards ---

  async createDashboard(dashboard: Record<string, unknown>) {
    const response = await this.request.post(`${API_URLS.reporting}/dashboards`, {
      data: dashboard,
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async deleteDashboard(id: string) {
    await this.request.delete(`${API_URLS.reporting}/dashboards/${id}`, {
      headers: this.getHeaders(),
    });
  }

  async getDashboards() {
    const response = await this.request.get(`${API_URLS.reporting}/dashboards`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // --- Export Jobs ---

  async createExportJob(job: Record<string, unknown>) {
    const response = await this.request.post(`${API_URLS.export}/jobs`, {
      data: job,
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async deleteExportJob(id: string) {
    await this.request.delete(`${API_URLS.export}/jobs/${id}`, {
      headers: this.getHeaders(),
    });
  }

  async getExportJobs() {
    const response = await this.request.get(`${API_URLS.export}/jobs`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // --- Users ---

  async createUser(user: Record<string, unknown>) {
    const response = await this.request.post(`${API_URLS.users}/users`, {
      data: user,
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async deleteUser(id: string) {
    await this.request.delete(`${API_URLS.users}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }

  async getUsers() {
    const response = await this.request.get(`${API_URLS.users}/users`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // --- Companies ---

  async createCompany(company: Record<string, unknown>) {
    const response = await this.request.post(`${API_URLS.users}/companies`, {
      data: company,
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async deleteCompany(id: string) {
    await this.request.delete(`${API_URLS.users}/companies/${id}`, {
      headers: this.getHeaders(),
    });
  }

  async getCompanies() {
    const response = await this.request.get(`${API_URLS.users}/companies`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // --- Health ---

  async checkHealth(service: keyof typeof API_URLS) {
    const response = await this.request.get(`${API_URLS[service]}/health`);
    return response.ok();
  }

  async checkAllHealth() {
    const results: Record<string, boolean> = {};
    for (const [name, url] of Object.entries(API_URLS)) {
      try {
        const response = await this.request.get(`${url}/health`);
        results[name] = response.ok();
      } catch {
        results[name] = false;
      }
    }
    return results;
  }
}
