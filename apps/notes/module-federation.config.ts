import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'notes',
  exposes: {
    './Routes': 'apps/notes/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
