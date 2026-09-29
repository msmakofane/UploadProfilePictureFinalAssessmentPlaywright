import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// override: true so .env wins over Windows' predefined USERNAME env var
dotenv.config({ override: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
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
  ],
});
