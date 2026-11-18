# 01: Walking skeleton

**What to build:** A minimal but complete path through every layer of the site, so every later ticket lands on a working harness. Running the project shows a Home page with Budi's name, role and one-line pitch, plus a shared layout with navigation and a footer (email, GitHub, LinkedIn). All of it reads from the single Site profile through the content query module. The same build is exercised by unit tests, browser tests with accessibility checks, and the Lighthouse gate, all running in CI on pull requests.

Spec: `.scratch/personal-site-v1/spec.md`

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Astro project with fully static output, Tailwind CSS v4 and React islands integration
- [ ] Site profile defined in one place (name, role, pitch, bio summary, email, GitHub URL, LinkedIn URL, canonical site URL `https://budigunawan.com`, default social image), using placeholder values
- [ ] Content query module exists as a pure module (entries + mode in, data out) with a thin adapter over Astro's collection loader; pages read content only through it
- [ ] Base layout with landmarks, navigation (Home, About, Projects; Blog left out until ticket 07), and footer showing email, GitHub and LinkedIn from the Site profile
- [ ] Home renders the hero (name, role, pitch) from the Site profile
- [ ] Vitest runs unit tests against the content query module, with at least one real test
- [ ] Playwright runs against the built site served by Astro's preview server; axe checks run on every route and report zero violations
- [ ] Lighthouse CI runs against the preview with a mobile profile and fails if any category is below 95 or CLS is above 0
- [ ] GitHub Actions workflow runs Vitest, Playwright and Lighthouse CI on pull requests
- [ ] `.scratch/` is gitignored
- [ ] A README explains how to run dev, build, preview and each test suite
