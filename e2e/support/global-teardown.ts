import { FullConfig } from '@playwright/test';

/**
 * Global teardown runs once after all tests
 */
async function globalTeardown(config: FullConfig): Promise<void> {
  console.log('Starting E2E global teardown...');

  // Cleanup any test data if needed
  // This is optional - most cleanup should happen in test afterEach/afterAll hooks

  console.log('E2E global teardown complete');
}

export default globalTeardown;
