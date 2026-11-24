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
- `src/content.config.ts` — the content schema: the single authority on what each content collection is.
- `src/content/work/` — one markdown file per Work Entry.
- `src/content/projects/` — one markdown file per Project.
- `src/content/posts/` — one markdown file per Post, retrospectives included.
- `public/images/projects/` — cover images referenced by Project frontmatter, served from the site's own origin.
- `public/images/posts/` — cover images referenced by Post frontmatter, served from the site's own origin.
- `src/lib/content.ts` — content queries used by pages, such as every Work Entry newest first, every published Project newest first, every published Post newest first, Posts carrying a tag, and Projects grouped by the Work Entry that produced them.
- `src/lib/dates.ts` — month-and-year and full-date formatting with the matching `<time datetime>` values, in UTC so a date never shifts.
- `src/pages/projects/` — the Projects index and the detail route.
- `src/pages/blog/` — the Blog index and the Post detail route.
- `src/pages/retro.astro` — the Retro index, reading the Posts tagged `retro`.
- `src/layouts/BaseLayout.astro` — document metadata, skip link, header, footer, and the slot for page content.
- `src/styles/global.css` — the two themes' colour tokens, the type pairing, focus states, reduced-motion handling, and the prose rules for markdown bodies.
- `src/components/ThemeInit.astro` — restores a stored theme before first paint.
- `src/components/ThemeToggle.astro` — the manual override.

## Theme

A first visit follows `prefers-color-scheme`. The toggle pins `data-theme="light"` or `data-theme="dark"` on `<html>` and stores the choice in `localStorage` under the key `theme`, so it survives reloads. Removing that key returns the site to the system preference.

Colours are declared once with `light-dark()` and mapped into Tailwind through `@theme inline`, so a utility such as `bg-canvas` is correct in both themes.

## Fonts

Fraunces (display), Inter (body), and JetBrains Mono (code) are installed from npm via Fontsource and emitted into the build. Every font file is served from the site's own origin; no request leaves for a font host.

## Navigation

Navigation is derived from `site.nav`. Add an entry only when the route it points at exists, so the shell never links to a 404.

## Content

Work Entries are markdown files in `src/content/work/`. Frontmatter declares `company`, `role`, `start`, and optionally `end`, with dates written as `YYYY-MM`; an absent `end` means the role is current and renders as such, never with a fabricated end date. The body records responsibilities, not Projects.

Projects are markdown files in `src/content/projects/`. Frontmatter declares `title`, `summary`, `kind` (`personal` or `professional`), `date` as `YYYY-MM-DD`, `stack`, `tags`, `built` and `impact`; it may also declare `workEntry`, `demoUrl`, `repoUrl`, `cover`, `featured` and `draft`. A Project's slug comes from its file name and is part of the public contract, so `janjiraga.md` serves `/projects/janjiraga`. `kind`, `stack` and `tags` are separate axes: language and framework names belong in `stack`, subject matter in `tags`. A `professional` Project may name the Work Entry that produced it by file name, such as `workEntry: paragon-corp`; the Work Entry then links to the Project. A cover image needs `src`, `alt`, `width` and `height`; the file lives under `public/images/projects/`, and the dimensions reserve space so the page does not shift as the image loads. `draft: true` hides a Project from production builds, the index and its detail route while keeping it visible in development.

Files are loaded through a glob, so a new markdown file appears on `/work`, `/projects` or `/blog` with no code change. Frontmatter is validated against `src/content.config.ts` at build time, and a missing or malformed required field fails the build naming that field.

Posts are markdown files in `src/content/posts/`. Frontmatter declares `title`, `summary`, `date` as `YYYY-MM-DD`, and `tags`; it may also declare `cover`, `featured` and `draft`. A Post's slug comes from its file name, so `rebuilding-this-site.md` serves `/blog/rebuilding-this-site`. A cover image needs `src`, `alt`, `width` and `height`, and its file lives under `public/images/posts/`. `/blog` lists published Posts newest first; a tag is displayed on the Post and its listing but is not a route. Retro is not a content type: a Post tagged `retro` appears on `/retro`, so a Retro is written exactly like any other Post. `draft: true` hides a Post from production builds, the Blog index and its detail route while keeping it visible in development.

Code fences are highlighted by Shiki at build time, in both a light and a dark palette chosen by the same signals as the rest of the theme. Each block gets a copy control that is added by script, so it never appears as a dead button without JavaScript, and code that overflows scrolls inside its own block rather than widening the page. Printing a Post drops the header, the footer and the copy controls.

## CI and deployment

`.github/workflows/ci.yml` runs `pnpm install --frozen-lockfile`, `pnpm check`, and `pnpm build` on every push and pull request, failing the run on type or build errors. Vercel's Git integration builds a preview deployment for each branch and production from `main`; CI validates the same commit.

Build scripts for `esbuild` and `sharp` are allowlisted in `pnpm-workspace.yaml` because pnpm blocks lifecycle scripts by default.
