import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'transformation',
  exposes: {
    './Routes': 'apps/transformation/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
