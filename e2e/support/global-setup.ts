import { FullConfig } from '@playwright/test';

/**
 * Global setup runs once before all tests
 */
async function globalSetup(config: FullConfig): Promise<void> {
  console.log('Starting E2E global setup...');

  // Verify services are running
  const services = [
    { name: 'Ingress API', url: 'http://localhost:3100/api/health' },
    { name: 'Transformation API', url: 'http://localhost:3200/api/health' },
    { name: 'Reporting API', url: 'http://localhost:3300/api/health' },
    { name: 'Export API', url: 'http://localhost:3400/api/health' },
    { name: 'Users API', url: 'http://localhost:3500/api/health' },
  ];

  for (const service of services) {
    try {
      const response = await fetch(service.url);
      if (!response.ok) {
        console.warn(`Warning: ${service.name} returned status ${response.status}`);
      } else {
        console.log(`${service.name}: OK`);
      }
    } catch (error) {
      console.warn(`Warning: ${service.name} is not reachable`);
    }
  }

  console.log('E2E global setup complete');
}

export default globalSetup;
