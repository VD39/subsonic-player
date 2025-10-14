import type { ConfigOptions } from '@nuxt/test-utils/playwright';

import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const timeout = 10000 * 15 * 2;

export default defineConfig<ConfigOptions>({
  forbidOnly: !!process.env.CI,
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Edge HiDPI'],
        video: {
          mode: 'on',
          size: {
            height: 1080,
            width: 1920,
          },
        },
        viewport: {
          height: 1080,
          width: 1920,
        },
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],
        video: {
          mode: 'on',
          size: {
            height: 844,
            width: 390,
          },
        },
        viewport: {
          height: 844,
          width: 390,
        },
      },
    },
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  timeout,
  use: {
    nuxt: {
      host: 'http://localhost:3000',
      rootDir: fileURLToPath(new URL('.', import.meta.url)),
      setupTimeout: timeout,
    },
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'yarn preview',
    stderr: 'pipe',
    stdout: 'ignore',
    timeout,
    url: 'http://localhost:3000',
  },
  workers: process.env.CI ? 2 : undefined,
});
