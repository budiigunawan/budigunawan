import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { routes } from './routes';

const themes = ['light', 'dark'] as const;

async function useTheme(page: Page, theme: (typeof themes)[number]) {
  await page.addInitScript((value) => {
    try {
      localStorage.setItem('theme', value);
    } catch {
      // Storage is optional; the theme still resolves from the system preference.
    }
  }, theme);
}

for (const theme of themes) {
  for (const route of routes) {
    test(`axe reports no violations on ${route} (${theme} theme)`, async ({ page }) => {
      await useTheme(page, theme);
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }
}
