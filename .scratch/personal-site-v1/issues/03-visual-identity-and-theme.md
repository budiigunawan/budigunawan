# 03: Visual identity and theme

**What to build:** The site gets its own visual identity: minimal editorial with tasteful motion, strong typography and generous whitespace, not copied from the reference site. A visitor sees a polished Home hero with three CTAs (Projects, CV, contact). The theme follows the system light/dark preference, can be switched with a toggle that is remembered, and never flashes the wrong theme on load. Keyboard, screen-reader and reduced-motion users are fully served, and a helpful 404 page exists. Every later page builds on these tokens.

Spec: `.scratch/personal-site-v1/spec.md`

**Blocked by:** 01 (Walking skeleton)

**Status:** ready-for-agent

- [ ] Design tokens defined once as the Tailwind theme: light and dark colour palettes, type scale, spacing, radii, motion durations
- [ ] Every text/UI colour pairing meets WCAG AA contrast in both themes
- [ ] Fonts are self-hosted and preloaded, with metric-matched fallbacks (no layout shift from font loading)
- [ ] Theme resolves stored choice → system preference, applied by an inline head script before first paint (no flash)
- [ ] Theme toggle switches and persists the choice; if storage is unavailable it still works for the session
- [ ] Code blocks and other themed surfaces are ready to follow the theme (tokens exposed for both modes)
- [ ] All motion is reduced or removed under `prefers-reduced-motion`
- [ ] "Skip to main content" link and a visible focus state on every interactive element
- [ ] Navigation marks the current section
- [ ] Links that leave the site are visually distinguishable
- [ ] Home hero restyled with name, role, pitch and CTAs to Projects, `/cv` and contact (CV target may 404 until ticket 04)
- [ ] 404 page with links back into the site
- [ ] Layout works from small phones to wide desktops without horizontal scrolling
- [ ] Playwright: toggle switches and persists across reload; with no stored choice the theme follows an emulated system preference; no wrong-theme flash; skip link moves focus to main; reduced motion disables animations; unknown URLs render the 404 page
- [ ] axe passes on every route in both themes; Lighthouse gate stays green
