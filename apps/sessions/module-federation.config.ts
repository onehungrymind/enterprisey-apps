import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'sessions',
  exposes: {
    './Routes': 'apps/sessions/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
