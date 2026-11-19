import { defineConfig, devices } from '@playwright/test';

// Deliberately not the preview port: a developer's `npm run preview` must never
// be mistaken for the Wrangler server these tests run against.
const PORT = 4322;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Wrangler is the production server, so the Cloudflare asset rules in
    // `public/` (such as `_headers`) apply to the built assets under test.
    command: `npm run build && npx wrangler dev --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      // A stand-in token so the tests exercise the analytics wiring. The
      // hostname gate keeps the beacon off the local server.
      PUBLIC_CF_ANALYTICS_TOKEN: 'e2e-analytics-token',
      WRANGLER_SEND_METRICS: 'false',
    },
  },
});
