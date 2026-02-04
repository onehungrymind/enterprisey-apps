import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'challenges',
  exposes: {
    './Routes': 'apps/challenges/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
