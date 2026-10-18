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
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
