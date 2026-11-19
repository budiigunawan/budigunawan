import { expect, test } from '@playwright/test';
import { siteProfile } from '../../src/data/site';
import { routes } from './routes';

test('motion runs for visitors who allow it', async ({ page }) => {
  await page.goto('/');

  const hero = page.getByRole('heading', { level: 1 });
  await expect(hero).not.toHaveCSS('animation-name', 'none');
});

test('reduced motion turns animations and transitions off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const hero = page.getByRole('heading', { level: 1 });
  await expect(hero).toHaveCSS('animation-name', 'none');

  const primaryLink = page.getByRole('link', { name: /view projects/i });
  await expect(primaryLink).toHaveCSS('transition-duration', '0s');
});

for (const width of [320, 768, 1440]) {
  test(`every route fits a ${width}px viewport without horizontal scrolling`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });

    for (const route of routes) {
      await page.goto(route);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} overflows at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

test('links that leave the site are marked for sighted and screen-reader visitors', async ({
  page,
}) => {
  await page.goto('/');

  const footer = page.getByRole('contentinfo');
  const github = footer.getByRole('link', { name: /github.*external/i });

  await expect(github).toHaveAttribute('href', siteProfile.githubUrl);
  await expect(footer.getByRole('link', { name: /linkedin.*external/i })).toBeVisible();
});
