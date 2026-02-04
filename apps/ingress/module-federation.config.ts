import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'ingress',
  exposes: {
    './Routes': 'apps/ingress/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
