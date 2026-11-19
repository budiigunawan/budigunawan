export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

export const THEME_CHANGE_EVENT = 'themechange';

export const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

declare global {
  interface Window {
    /** Set once the visitor picks a theme, so system changes stop overriding it. */
    themeChoiceMade?: boolean;
  }
}

export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/** Applies the theme to the document. Persisting is skipped when following the system. */
export function applyTheme(theme: Theme, { persist }: { persist: boolean }): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  if (persist) {
    window.themeChoiceMade = true;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage can be blocked; the switch still holds for this visit.
    }
  }
}
