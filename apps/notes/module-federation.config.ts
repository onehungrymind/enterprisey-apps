import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'notes',
  exposes: {
    './Routes': 'apps/notes/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
