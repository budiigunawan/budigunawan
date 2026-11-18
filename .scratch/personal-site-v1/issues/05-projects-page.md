# 05: Projects page

**What to build:** A hiring manager can open Projects and see every Project as a card with its title, short summary and Stack, newest first. A card without a Case Study links out to the Project's live site (preferred) or repository, with an external-link indicator. Budi adds a small Project with just a few fields. Case Studies and Featured Projects come in ticket 06.

Spec: `.scratch/personal-site-v1/spec.md`

**Blocked by:** 03 (Visual identity and theme)

**Status:** ready-for-agent

- [ ] Project collection (MDX) with title, summary, Stack, date, optional repository URL, optional live URL, and featured flag (defaults false)
- [ ] The build fails if a Project has neither a Case Study (body content) nor at least one external link
- [ ] Content query module exposes Projects in display order (Featured first, then the rest newest first) and the Project link target (Case Study URL → live URL → repository URL)
- [ ] Projects page lists every Project as a card showing title, summary and Stack
- [ ] Cards link to their link target; external targets carry a visible external-link indicator and an accessible name that says the link leaves the site
- [ ] A few placeholder Projects exist, including ones with only a live URL and only a repository URL
- [ ] Projects appears in navigation and is marked current on its page
- [ ] Vitest: display order, link-target precedence, and the "Case Study or link" validation
- [ ] Playwright: every card without a Case Study links externally
- [ ] axe and Lighthouse gates pass with Projects added to the checked routes
