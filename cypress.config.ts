import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    scrollBehavior: 'nearest',
    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
})
