import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'export',
  exposes: {
    './Routes': 'apps/export/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
