import { defineConfig } from 'cypress'
import coverageTask from '@cypress/code-coverage/task'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import alertsApi from './integration_tests/mockApis/alertsApi'
import prisonerSearchApi from './integration_tests/mockApis/prisonerSearchApi'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  e2e: {
    setupNodeEvents(on, config) {
      coverageTask(on, config)
      on('task', {
        reset: resetStubs,
        ...auth,
        ...tokenVerification,
        ...alertsApi,
        ...prisonerSearchApi,
      })
      return config
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: ['dist', '**/!(*.cy).ts'],
    specPattern: '**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
    experimentalRunAllSpecs: true,
    env: {
      codeCoverage: {
        url: 'http://localhost:3007/__coverage__',
      },
    },
    retries: {
      runMode: 2,
    },
  },
})
