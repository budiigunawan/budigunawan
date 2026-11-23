# budigunawan.com

The public site of Budi Indra Gunawan: Work Entries, Projects and Posts.

## Stack

- [Astro 5](https://astro.build) with `output: 'static'`. The Vercel adapter is installed so the future Contact endpoint can opt out of prerendering, but every page today is prerendered.
- TypeScript, strict.
- Tailwind CSS 4 via the Vite plugin.
- pnpm, pinned through `packageManager` in `package.json`.

## Commands

| Command        | What it does                                  |
| -------------- | --------------------------------------------- |
| `pnpm dev`     | Start the dev server at `localhost:4321`      |
| `pnpm check`   | Type check `.astro` and TypeScript files       |
| `pnpm build`   | Build the production site into `dist/`        |
| `pnpm preview` | Serve the built site locally                  |

## Structure

- `src/config/site.ts` — the single source of truth for identity, the canonical URL, navigation and social links. The Astro config imports its URL, so pages and metadata cannot disagree about the domain.
- `src/layouts/BaseLayout.astro` — document metadata, skip link, header, footer, and the slot for page content.
- `src/styles/global.css` — the two themes' colour tokens, the type pairing, focus states, and reduced-motion handling.
- `src/components/ThemeInit.astro` — restores a stored theme before first paint.
- `src/components/ThemeToggle.astro` — the manual override.

## Theme

A first visit follows `prefers-color-scheme`. The toggle pins `data-theme="light"` or `data-theme="dark"` on `<html>` and stores the choice in `localStorage` under the key `theme`, so it survives reloads. Removing that key returns the site to the system preference.

Colours are declared once with `light-dark()` and mapped into Tailwind through `@theme inline`, so a utility such as `bg-canvas` is correct in both themes.

## Fonts

Fraunces (display), Inter (body), and JetBrains Mono (code) are installed from npm via Fontsource and emitted into the build. Every font file is served from the site's own origin; no request leaves for a font host.

## Navigation

Navigation is derived from `site.nav`. Add an entry only when the route it points at exists, so the shell never links to a 404.

## CI and deployment

`.github/workflows/ci.yml` runs `pnpm install --frozen-lockfile`, `pnpm check`, and `pnpm build` on every push and pull request, failing the run on type or build errors. Vercel's Git integration builds a preview deployment for each branch and production from `main`; CI validates the same commit.

Build scripts for `esbuild` and `sharp` are allowlisted in `pnpm-workspace.yaml` because pnpm blocks lifecycle scripts by default.
