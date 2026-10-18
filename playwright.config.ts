import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// override: true so .env wins over Windows' predefined USERNAME env var
dotenv.config({ override: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // single worker: chromium/firefox + the UI/API specs all log in, and the backend invalidates
  // any other active session on login, so concurrent runs fail each other with 401s
  workers: 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      // api spec only uses the `request` fixture, so it belongs in its own project
      // instead of running (and reporting a result) under both browser projects below
      name: 'api',
      testMatch: '**/api/**',
    },
    {
      name: 'chromium',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
