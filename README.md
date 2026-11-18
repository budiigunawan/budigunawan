# budigunawan.com

The personal site of Budi Gunawan: a fully static Astro site with Tailwind CSS
and React islands, deployed to Cloudflare.

## Requirements

- Node.js 22.23.4 or newer
- npm

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:4321 and returns the current content,
including Drafts while writing.

## Commands

| Command                   | What it does                                                   |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev`             | Start the dev server                                           |
| `npm run build`           | Build the static site into `dist/`                             |
| `npm run preview`         | Serve the built site from `dist/` at http://localhost:4321     |
| `npm run check`           | Type-check Astro and TypeScript files                          |
| `npm test`                | Run unit tests with Vitest                                     |
| `npm run test:watch`      | Run unit tests in watch mode                                   |
| `npm run test:e2e`        | Build, preview and run the Playwright suite with axe checks    |
| `npm run test:lighthouse` | Build, preview and run the Lighthouse CI gate on key routes    |
| `npm run deploy`          | Deploy `dist/` to Cloudflare Workers with Wrangler             |

`npm run test:e2e` and `npm run test:lighthouse` start and stop the preview
server for you, so no extra terminal is needed.

The browser tests need the Chromium browser once:

```bash
npx playwright install chromium
```

## Project layout

```
src/
├── content.config.ts         # Content collection schemas
├── content/                  # Content entries (Posts live here)
├── data/site.ts              # Site profile: name, role, pitch, social links
├── layouts/BaseLayout.astro  # Landmarks, navigation, footer
├── lib/content/
│   ├── query.ts              # Pure content query module (entries + mode in, data out)
│   └── index.ts              # Adapter over Astro's collection loader
├── pages/                    # Routes
└── styles/global.css         # Tailwind entry point and design tokens
tests/
├── unit/                     # Vitest tests for the content query module
└── e2e/                      # Playwright tests and axe accessibility checks
```

Pages never read collections directly. They call `getContent()` from
`src/lib/content`, which loads entries, applies the production or development
mode, and hands them to the pure query functions.

## Content

- Site-wide profile details (name, role, pitch, bio, email, GitHub, LinkedIn,
  canonical URL, default social image) live in `src/data/site.ts`.
- Posts are MDX files in `src/content/posts/`. A Post with `draft: true` is
  visible in development and never in a production build.

## Quality gates

Every pull request runs type checking, the Vitest suite, the Playwright suite
against a production build (including axe on every route), and Lighthouse CI
with a mobile profile. Lighthouse fails if any category is below 95 or if
cumulative layout shift is above zero.

## Deployment

The site is a static build served by Cloudflare Workers with static assets.
`wrangler.jsonc` holds the Worker name (`budigunawan`), the `dist/` assets
directory and the 404 handling; the custom domain is added at launch. Workers
Builds deploys it:

- **Production**: every push to `main` deploys. Until the cutover the site
  lives on the Worker's `workers.dev` hostname, while the old site keeps
  `budigunawan.com`.
- **Previews**: every other branch gets a preview build at
  `<preview-name>-budigunawan.<account>.workers.dev` and a link in the pull
  request.
- **CI**: GitHub Actions runs the type check, Vitest, Playwright with axe and
  the Lighthouse gate on every pull request. Branch protection on `main`
  requires the `Tests and quality gates` check before merging.
- **Analytics**: Cloudflare Web Analytics loads only on `budigunawan.com`. The
  token arrives as the `PUBLIC_CF_ANALYTICS_TOKEN` build variable, and
  `src/scripts/analytics.ts` checks the hostname before adding the beacon, so
  previews and local builds never report.

`npm run deploy` runs a one-off `wrangler deploy` from your machine (it needs
`npx wrangler login` first); normal deploys go through Workers Builds. Build
the site first, or Wrangler uploads a stale `dist/`.

The one-time account setup — connecting the repository, the build settings, the
analytics token, the custom domain, the `www` redirect and branch protection —
is in [docs/deployment.md](docs/deployment.md).

## Content still to be supplied

The Site profile and the pages currently use placeholder values. Before launch,
replace the profile details in `src/data/site.ts` with Budi's real email, GitHub
and LinkedIn URLs, and swap `public/og-default.png` for the final social image.
