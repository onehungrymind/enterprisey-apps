/**
 * Test data constants for E2E tests
 */

export const TEST_USERS = {
  admin: {
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  manager: {
    email: 'manager@example.com',
    password: 'password123',
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager',
  },
  user: {
    email: 'user@example.com',
    password: 'password123',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user',
  },
} as const;

export const PAGES = {
  login: '/login',
  portal: 'http://localhost:4200',
  dashboard: 'http://localhost:4200',
  ingress: 'http://localhost:4201',
  transformation: 'http://localhost:4202',
  reporting: 'http://localhost:4203',
  export: 'http://localhost:4204',
  users: 'http://localhost:4205',
} as const;

export const API_URLS = {
  ingress: 'http://localhost:3100/api',
  transformation: 'http://localhost:3200/api',
  reporting: 'http://localhost:3300/api',
  export: 'http://localhost:3400/api',
  users: 'http://localhost:3500/api',
  features: 'http://localhost:3600/api',
} as const;

export const TIMEOUTS = {
  short: 5000,
  medium: 10000,
  long: 30000,
  veryLong: 60000,
} as const;

export const TEST_DATA = {
  sources: {
    database: {
      name: 'Test Database',
      type: 'database',
      host: 'localhost',
      port: 5432,
      database: 'testdb',
      username: 'testuser',
      password: 'testpass',
    },
    restApi: {
      name: 'Test API',
      type: 'rest_api',
      url: 'https://api.example.com/data',
      method: 'GET',
    },
    csvFile: {
      name: 'Test CSV',
      type: 'csv_file',
      filePath: '/data/test.csv',
      delimiter: ',',
      hasHeader: true,
    },
  },
  pipelines: {
    basic: {
      name: 'Test Pipeline',
      description: 'A test pipeline for E2E testing',
      status: 'draft',
    },
  },
  dashboards: {
    basic: {
      name: 'Test Dashboard',
      description: 'A test dashboard for E2E testing',
    },
  },
  exportJobs: {
    basic: {
      name: 'Test Export',
      format: 'csv',
    },
  },
  companies: {
    basic: {
      name: 'Test Company',
    },
  },
} as const;
