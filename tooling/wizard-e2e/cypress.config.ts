import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run wizard:serve:development',
        production: 'nx run wizard:serve:production',
      },
      ciWebServerCommand: 'nx run wizard:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
