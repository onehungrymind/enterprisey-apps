// import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
// import { defineConfig } from 'cypress';

// export default defineConfig({
//   e2e: {
//     ...nxE2EPreset(__filename, {
//       cypressDir: 'src',
//       webServerCommands: {
//         default: 'nx run wizard:serve:development',
//         production: 'nx run wizard:serve:production',
//       },
//       ciWebServerCommand: 'nx run wizard:serve-static',
//     }),
//     baseUrl: 'http://localhost:4200',
//   },
// });

import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4800",
    supportFile: false,
    specPattern: "**/*.feature",
    setupNodeEvents,
  },
});
