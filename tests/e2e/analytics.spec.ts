import { expect, test, type Page } from '@playwright/test';
import { siteProfile } from '../../src/data/site';

const beaconUrl = 'https://static.cloudflareinsights.com/beacon.min.js';
const productionOrigin = new URL(siteProfile.siteUrl).origin;

function recordBeaconRequests(page: Page): string[] {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().startsWith(beaconUrl)) {
      requests.push(request.url());
    }
  });
  return requests;
}

test('the analytics beacon stays off the local preview', async ({ page }) => {
  const beaconRequests = recordBeaconRequests(page);

  await page.goto('/');

  await expect(page.locator('body')).toHaveAttribute('data-analytics-host', 'budigunawan.com');
  await expect(page.locator(`script[src="${beaconUrl}"]`)).toHaveCount(0);
  expect(beaconRequests).toEqual([]);
});

test('the analytics beacon loads on the production hostname only', async ({ page, request }) => {
  const beaconRequests = recordBeaconRequests(page);

  await page.route('**/beacon.min.js', (route) => route.fulfill({ status: 204, body: '' }));
  await page.route(`${productionOrigin}/**`, async (route) => {
    const { pathname, search } = new URL(route.request().url());
    const response = await request.get(`${pathname}${search}`);

    await route.fulfill({
      status: response.status(),
      contentType: response.headers()['content-type'],
      body: await response.body(),
    });
  });

  await page.goto(`${productionOrigin}/`);
  // Let every proxied subresource settle, so no route handler outlives the test.
  await page.waitForLoadState('networkidle');

  const token = await page.locator('body').getAttribute('data-analytics-token');
  test.skip(!token, 'This build has no analytics token, so there is no beacon to load');

  const beacon = page.locator(`script[src="${beaconUrl}"]`);
  await expect(beacon).toHaveCount(1);
  await expect(beacon).toHaveAttribute('data-cf-beacon', JSON.stringify({ token }));
  await expect.poll(() => beaconRequests.length).toBeGreaterThan(0);
});
