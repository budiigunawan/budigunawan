import { expect, test, type Page } from '@playwright/test';

const html = (page: Page) => page.locator('html');
const themeToggle = (page: Page) => page.getByRole('button', { name: 'Dark theme' });

test('with no stored choice the theme follows the system preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(html(page)).toHaveAttribute('data-theme', 'dark');

  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(html(page)).toHaveAttribute('data-theme', 'light');
});

test('a visitor with no stored choice follows a change to the system preference', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(html(page)).toHaveAttribute('data-theme', 'light');

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(html(page)).toHaveAttribute('data-theme', 'dark');
});

test('the stored choice is applied before the first frame paints', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark');

    const frames: Array<string | null> = [];
    (window as unknown as { themeFrames: Array<string | null> }).themeFrames = frames;

    const record = () => {
      frames.push(document.documentElement.dataset.theme ?? null);
      if (frames.length < 3) requestAnimationFrame(record);
    };
    requestAnimationFrame(record);
  });

  // Without the hydrated island, only the inline head script can set the theme.
  await page.route('**/_astro/*.js', (route) => route.abort());
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const firstFrameTheme = await page.evaluate(
    () => (window as unknown as { themeFrames: Array<string | null> }).themeFrames[0],
  );
  expect(firstFrameTheme).toBe('dark');
  await expect(html(page)).toHaveAttribute('data-theme', 'dark');
});

test('the toggle switches the theme and remembers the choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  await expect(html(page)).toHaveAttribute('data-theme', 'light');
  await expect(themeToggle(page)).toHaveAttribute('aria-pressed', 'false');

  await themeToggle(page).click();
  await expect(html(page)).toHaveAttribute('data-theme', 'dark');
  await expect(themeToggle(page)).toHaveAttribute('aria-pressed', 'true');

  await page.reload();
  await expect(html(page)).toHaveAttribute('data-theme', 'dark');
  await expect(themeToggle(page)).toHaveAttribute('aria-pressed', 'true');

  // A stored choice outranks a dark system preference once switched back.
  await page.emulateMedia({ colorScheme: 'dark' });
  await themeToggle(page).click();
  await expect(html(page)).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(html(page)).toHaveAttribute('data-theme', 'light');
});

test('the toggle still works when the browser blocks storage', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException('Storage is blocked', 'SecurityError');
    };
    Storage.prototype.getItem = blocked;
    Storage.prototype.setItem = blocked;
  });

  await page.goto('/');
  await expect(html(page)).toHaveAttribute('data-theme', 'light');

  await themeToggle(page).click();
  await expect(html(page)).toHaveAttribute('data-theme', 'dark');

  await themeToggle(page).click();
  await expect(html(page)).toHaveAttribute('data-theme', 'light');
});
