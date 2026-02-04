import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'flashcards',
  exposes: {
    './Routes': 'apps/flashcards/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
