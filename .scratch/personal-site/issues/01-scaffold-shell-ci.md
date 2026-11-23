# 01: Scaffold, shell and CI

**What to build:** A deployed but empty site that is already the real one. An Astro 5 project in strict TypeScript with Tailwind 4 and pnpm, a site configuration module owning Budi's identity, navigation, social links and canonical base URL, a layout shell emitting head metadata, nav, footer and a theme toggle, the editorial type pairing with self-hosted fonts, light and dark themes that follow the system preference with a persisted manual override, a styled 404, and CI running type checking and a production build against a Vercel preview.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The preview URL renders the shell: navigation, footer with social links, and a placeholder home page.
- [ ] Navigation offers only routes that exist at this point, so no link in the shell 404s.
- [ ] A first visit follows the operating system's light or dark preference; toggling manually persists across reloads.
- [ ] Fonts load from the site's own origin, and no request leaves the site for a font host.
- [ ] The 404 page is styled like the rest of the site and offers a route back in.
- [ ] Type checking and the production build run in CI on every push and fail the run on error.
- [ ] Every page is usable at 320px with no horizontal scrolling, and every interactive element shows a visible focus state.
