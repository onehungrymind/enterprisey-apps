import { InjectionToken } from '@angular/core';

export interface AppEnvironment {
  featuresApiUrl: string;
  ingressApiUrl: string;
  transformationApiUrl: string;
  reportingApiUrl: string;
  exportApiUrl: string;
  usersApiUrl: string;
  production: boolean;
}

export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>('AppEnvironment');

export const DEFAULT_ENVIRONMENT: AppEnvironment = {
  featuresApiUrl: 'http://localhost:3000/api',
  ingressApiUrl: 'http://localhost:3100/api',
  transformationApiUrl: 'http://localhost:3200/api',
  reportingApiUrl: 'http://localhost:3300/api',
  exportApiUrl: 'http://localhost:3400/api',
  usersApiUrl: 'http://localhost:3500/api',
  production: false,
};
