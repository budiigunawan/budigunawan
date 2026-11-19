import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { siteProfile } from '../../src/data/site';

interface Role {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
}

const experienceDir = join(process.cwd(), 'src/content/experience');

/** The Experience entries the page is expected to render. */
const roles: Role[] = readdirSync(experienceDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(join(experienceDir, file), 'utf8')));

test.beforeEach(() => {
  test.skip(roles.length === 0, 'There are no Experience entries to render');
});

test('About introduces Budi with the profile bio and a link to the CV', async ({ page }) => {
  await page.goto('/about');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About');
  await expect(page.getByText(siteProfile.bioSummary)).toBeVisible();
  await expect(page.getByRole('link', { name: /download cv/i })).toHaveAttribute('href', '/cv');
});

test('About renders one timeline item per Experience', async ({ page }) => {
  await page.goto('/about');

  const timeline = page.locator('section[aria-labelledby="experience-heading"]');
  await expect(timeline.getByRole('heading', { level: 2 })).toHaveText('Experience');

  const items = timeline.locator('ol > li');
  await expect(items).toHaveCount(roles.length);

  for (const role of roles) {
    const item = items.filter({
      has: page.getByRole('heading', { level: 3, name: role.title, exact: true }),
    });

    await expect(item).toHaveCount(1);
    await expect(item).toContainText(role.company);
    for (const highlight of role.highlights) {
      await expect(item).toContainText(highlight);
    }
  }
});

test('ongoing roles read Present and come before finished roles', async ({ page }) => {
  await page.goto('/about');

  const texts = await page
    .locator('section[aria-labelledby="experience-heading"] ol > li > p:first-of-type')
    .allInnerTexts();

  expect(texts).toHaveLength(roles.length);
  for (const text of texts) {
    expect(text).toMatch(/^[A-Z][a-z]{2} \d{4} — ([A-Z][a-z]{2} \d{4}|Present)$/);
  }

  const ongoing = texts.map((text) => text.endsWith('Present'));
  const firstFinished = ongoing.indexOf(false);
  expect(ongoing.slice(firstFinished === -1 ? ongoing.length : firstFinished)).not.toContain(
    true,
  );
  expect(ongoing.filter(Boolean)).toHaveLength(
    roles.filter((role) => role.endDate === undefined).length,
  );
});
