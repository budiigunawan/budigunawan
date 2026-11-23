# 01: Scaffold, shell and CI

**What to build:** A deployed but empty site that is already the real one. An Astro 5 project in strict TypeScript with Tailwind 4 and pnpm, a site configuration module owning Budi's identity, navigation, social links and canonical base URL, a layout shell emitting head metadata, nav, footer and a theme toggle, the editorial type pairing with self-hosted fonts, light and dark themes that follow the system preference with a persisted manual override, a styled 404, and CI running type checking and a production build against a Vercel preview.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] The preview URL renders the shell: navigation, footer with social links, and a placeholder home page. (Live at https://budigunawan.vercel.app/.)
- [x] Navigation offers only routes that exist at this point, so no link in the shell 404s.
- [x] A first visit follows the operating system's light or dark preference; toggling manually persists across reloads.
- [x] Fonts load from the site's own origin, and no request leaves the site for a font host.
- [x] The 404 page is styled like the rest of the site and offers a route back in.
- [x] Type checking and the production build run in CI on every push and fail the run on error.
- [x] Every page is usable at 320px with no horizontal scrolling, and every interactive element shows a visible focus state.

## Comments

**2026-11-23 — Implemented**

- Astro 5.18 in strict TypeScript, Tailwind 4 through `@tailwindcss/vite`, pnpm pinned by `packageManager`, and the Vercel adapter with `output: 'static'`.
- `src/config/site.ts` owns identity, the canonical URL, navigation and social links; `astro.config.ts` imports its URL so pages and metadata cannot disagree about the domain.
- `BaseLayout` emits title, description, canonical, Open Graph and theme metadata, plus a skip link. `SiteHeader`, `SiteFooter` and `ThemeToggle` render the shell.
- Theme tokens use `light-dark()`, so a first visit follows `prefers-color-scheme` with no JavaScript. The toggle pins `data-theme` and stores `theme` in localStorage, and the pre-paint inline script restores it.
- Fraunces, Inter and JetBrains Mono are self-hosted from npm through Fontsource; the build emits them under `/_astro`, and the browser requested only the two Latin subsets in use.
- The 404 page reuses the shell, is noindex, and links home.
- `.github/workflows/ci.yml` runs `pnpm install --frozen-lockfile`, `pnpm check` and `pnpm build` on every push and pull request.

Verification: `pnpm check` reports 0 errors and `pnpm build` succeeds. `astro preview` served `/` with 200 and unknown paths with the styled 404. On the live deployment, `/` returns 200, unknown paths return the styled 404 with `noindex`, the only requested hosts are the site's own, the OS preference applies on first visit, the toggle persists across reloads, and 320px has no horizontal overflow. Browser checks on the build confirmed 2px accent focus rings on links and the toggle, and no resource requests off the site's origin.

Deployment and CI: https://budigunawan.vercel.app/ serves the site. CI run 45156633974 passed on `main`, with both the type check and build steps succeeding.
