import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'users',
  exposes: {
    './Routes': 'apps/users/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
