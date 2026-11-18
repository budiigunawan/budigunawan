# 08: Tag pages

**What to build:** A reader can open a Tag and see every published Post about that topic at a stable, shareable URL `/blog/tags/<tag-slug>`. The Blog index links to every Tag page, and the Tags on each Post link to their pages. Tags that differ only in casing ("React" and "react") are the same Tag, so topics never split.

Spec: `.scratch/personal-site-v1/spec.md`

**Blocked by:** 07 (Blog core and visibility)

**Status:** ready-for-agent

- [ ] Content query module exposes Tags (from published Posts only), each with slug, display label (first-seen casing) and Post count, and the Posts for a Tag slug, newest first
- [ ] Tags are merged case-insensitively and slugged to lowercase
- [ ] A static page is generated per Tag at `/blog/tags/<tag-slug>`, only while the Blog is visible
- [ ] Blog index links to every Tag page; Post Tags link to their Tag pages
- [ ] A Tag used only by Drafts produces no Tag page in production
- [ ] Vitest: case-insensitive merging, slugs, labels, counts, Draft-only Tags excluded, Posts for a Tag
- [ ] Playwright: every Tag page lists only Posts carrying that Tag; no Draft appears on Tag pages
- [ ] axe and Lighthouse gates pass with a Tag page added to the checked routes
