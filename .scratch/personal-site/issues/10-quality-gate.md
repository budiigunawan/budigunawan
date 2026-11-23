# 10: Quality gate

**What to build:** A verification pass across every built page rather than new surface: accessibility, small-screen layout, reduced motion, both themes, and a green CI run over the whole suite. This is where the site earns the right to be called finished, and where any gap left by earlier tickets is closed.

**Blocked by:** 05: Home composed from real content, 06: Resume and privacy, 08: Contact form, with and without JavaScript

**Status:** ready-for-agent

- [ ] An automated accessibility check reports no serious or critical violations on any route.
- [ ] Every route renders at 320px without horizontal scrolling.
- [ ] With reduced motion set at the operating system level, transitions are instant rather than merely faster.
- [ ] Every interactive element has a visible focus state in both light and dark themes.
- [ ] Text and controls meet the stated contrast target in both themes.
- [ ] Type checking, the production build, the endpoint tests and the browser smoke test all pass in CI.
- [ ] No page requests a font, script, stylesheet or image from a third-party origin, except the analytics endpoint.
- [ ] The 404 page is reachable, styled, and offers a way back into the site.
