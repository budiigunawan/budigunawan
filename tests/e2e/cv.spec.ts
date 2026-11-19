import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('the CV is served as a PDF at the stable /cv URL', async ({ request }) => {
  const response = await request.get('/cv');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('application/pdf');

  const body = await response.body();
  expect(body.subarray(0, 5).toString()).toBe('%PDF-');
  // Whatever `public/cv.pdf` holds is what the stable URL returns, so replacing
  // that one file updates the CV without touching the address.
  expect(body.equals(readFileSync('public/cv.pdf'))).toBe(true);
});
