import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'reporting',
  exposes: {
    './Routes': 'apps/reporting/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
