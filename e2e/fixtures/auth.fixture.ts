import { test as base } from '@playwright/test';

export interface AuthFixture {
  authenticatedPage: ReturnType<typeof base.extend>;
}

export const test = base.extend<{ authToken: string }>({
  authToken: async ({ request }, use) => {
    const response = await request.post('http://localhost:3500/api/auth/login', {
      data: { email: 'admin@test.com', password: 'admin' },
    });
    const { token } = await response.json();
    await use(token);
  },
});
