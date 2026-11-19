import { useEffect, useState } from 'react';
import {
  DARK_MODE_QUERY,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  applyTheme,
  currentTheme,
  resolveTheme,
  type Theme,
} from '../lib/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(currentTheme());

    const media = window.matchMedia(DARK_MODE_QUERY);

    // The inline head script follows system changes; mirror them into button state.
    const syncFromDocument = () => setTheme(currentTheme());

    const syncTabs = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const next = resolveTheme(event.newValue, media.matches);
      applyTheme(next, { persist: false });
      setTheme(next);
    };

    document.addEventListener(THEME_CHANGE_EVENT, syncFromDocument);
    window.addEventListener('storage', syncTabs);
    return () => {
      document.removeEventListener(THEME_CHANGE_EVENT, syncFromDocument);
      window.removeEventListener('storage', syncTabs);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Dark theme"
      aria-pressed={isDark}
      onClick={() => {
        const next = isDark ? 'light' : 'dark';
        applyTheme(next, { persist: true });
        setTheme(next);
      }}
    >
      <svg
        className="theme-toggle__icon theme-toggle__icon--sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        className="theme-toggle__icon theme-toggle__icon--moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
      </svg>
    </button>
  );
}
