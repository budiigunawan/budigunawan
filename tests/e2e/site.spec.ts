import { expect, test } from '@playwright/test';
import { siteProfile } from '../../src/data/site';

test('Home introduces Budi with name, role and pitch', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(siteProfile.name);
  await expect(page.getByText(siteProfile.role)).toBeVisible();
  await expect(page.getByText(siteProfile.pitch)).toBeVisible();
});

test('navigation reaches every section and marks the current one', async ({ page }) => {
  await page.goto('/about');

  const navigation = page.getByRole('navigation', { name: 'Main' });
  const about = navigation.getByRole('link', { name: 'About' });

  await expect(about).toHaveAttribute('aria-current', 'page');
  await expect(navigation.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
    'aria-current',
    'page',
  );

  await navigation.getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL('/projects');
  await expect(
    page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Projects' }),
  ).toHaveAttribute('aria-current', 'page');
});

test('every page shows contact details in the footer', async ({ page }) => {
  for (const route of ['/', '/about', '/projects']) {
    await page.goto(route);

    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: siteProfile.email })).toHaveAttribute(
      'href',
      `mailto:${siteProfile.email}`,
    );
    await expect(footer.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      siteProfile.githubUrl,
    );
    await expect(footer.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      siteProfile.linkedinUrl,
    );
  }
});

test('the skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');

  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('unknown URLs show the not-found page', async ({ page }) => {
  const response = await page.goto('/no-such-page');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'home page' })).toHaveAttribute('href', '/');
});
