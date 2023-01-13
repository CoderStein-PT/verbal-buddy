import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    scrollBehavior: 'nearest',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
})
