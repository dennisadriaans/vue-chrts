import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }]
  ],

  use: {
    baseURL: 'https://nuxtcharts.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  /* Folder for visual regression snapshots */
  snapshotDir: './tests/e2e/__snapshots__',

  /* Timeout for each test */
  timeout: 60000,

  /* Timeout for each expect assertion */
  expect: {
    timeout: 10000
  }
})
