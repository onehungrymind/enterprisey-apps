import { Provider } from '@angular/core';
import { APP_ENVIRONMENT, AppEnvironment, DEFAULT_ENVIRONMENT } from './environment';

export function provideEnvironment(overrides: Partial<AppEnvironment> = {}): Provider {
  return {
    provide: APP_ENVIRONMENT,
    useValue: { ...DEFAULT_ENVIRONMENT, ...overrides },
  };
}
