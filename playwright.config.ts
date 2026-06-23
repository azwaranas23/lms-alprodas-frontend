import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  retries: 0,

  workers: 1,

  reporter: [
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: 'https://alprodas.web.id',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
      },
    },
  ],
});