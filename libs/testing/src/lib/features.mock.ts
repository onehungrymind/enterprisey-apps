/* eslint-disable @typescript-eslint/no-empty-function */
import { Feature } from '@proto/api-interfaces';
import { of } from 'rxjs';

export const mockFeaturesFacade = {
  loadFeatures: () => {},
  selectFeature: () => {},
  deleteFeature: () => {},
  updateFeature: () => {},
  createFeature: () => {},
};

export const mockFeaturesService = {
  all: () => of([]),
  find: () => of({ ...mockFeature }),
  create: () => of({ ...mockFeature }),
  update: () => of({ ...mockFeature }),
  delete: () => of({ ...mockFeature }),
};

export const mockFeature: Feature = {
  id: '0',
  title: 'mock',
  description: 'mock',
  remote_uri: 'mock',
  api_uri: 'mock',
  slug: 'mock',
  healthy: false,
};

export const mockEmptyFeature: Feature = {
  id: null,
  title: 'mockEmpty',
  description: 'mockEmpty',
  remote_uri: 'mockEmpty',
  api_uri: 'mockEmpty',
  slug: 'mockEmpty',
  healthy: false,
};
