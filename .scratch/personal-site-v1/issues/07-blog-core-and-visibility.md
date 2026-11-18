# 07: Blog core and visibility

**What to build:** Budi writes a Post as an MDX file and can mark it as a Draft. Drafts appear (clearly marked) when running locally and never in production output. Once at least one published Post exists, the Blog appears automatically: the Blog nav link, the 3 latest Posts on Home, the Blog index (newest first, showing title, description, publish date, reading time and Tags), each Post page and the RSS feed. With zero published Posts none of these exist, so no visitor ever sees an empty Blog. Tag pages come in ticket 08; until then Tags are shown as plain labels.

Spec: `.scratch/personal-site-v1/spec.md`

**Blocked by:** 03 (Visual identity and theme)

**Status:** ready-for-agent

- [ ] Post collection (MDX) with required title, description and publish date; optional updated date; Tags list; draft flag defaulting to false; optional hero image. Missing required fields fail the build
- [ ] Content query module exposes published Posts (newest first; Drafts excluded in production, included and flagged in development), latest n Posts, Blog visibility and reading time (about 200 wpm, rounded up, minimum 1)
- [ ] When the Blog is visible: Blog nav link, Home latest-3-Posts section, Blog index, Post pages and `/rss.xml` are produced; when not visible, none of them are
- [ ] Post page shows title, publish date, updated date (if any), reading time, Tags and content, and can embed React components
- [ ] Drafts show a visible Draft badge in development
- [ ] RSS feed is valid XML listing published Posts with title, description, date and link using the canonical domain
- [ ] Placeholder Posts exist, including at least one Draft
- [ ] Vitest: Draft exclusion per mode; Blog visibility false with zero Posts and with only Drafts, true otherwise; ordering; latest n; reading time rounding and minimum
- [ ] Playwright: no Draft appears in any production page, Home, or RSS; RSS lists exactly the published Posts; Blog routes return 200
- [ ] axe and Lighthouse gates pass with Blog index and a Post added to the checked routes
