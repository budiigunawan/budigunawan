# 10: SEO, social metadata and OG images

**What to build:** Search engines index the right pages on budigunawan.com, and any shared link previews well. Every page has canonical, Open Graph and Twitter card metadata. Each Post gets its own generated 1200×630 preview image with its title and site branding, and every other page uses one default branded image. Structured data describes Budi as a Person (Home and About) and each Post as an Article. A sitemap and robots file are generated, and the sitemap never lists Drafts.

Spec: `.scratch/personal-site-v1/spec.md`

**Blocked by:** 07 (Blog core and visibility)

**Status:** ready-for-agent

- [ ] Canonical URLs on every page use `https://budigunawan.com`
- [ ] Open Graph and Twitter card metadata (title, description, image, URL) on every page, from the Site profile and page content
- [ ] OG images generated at build time: one per published Post (title + branding, 1200×630) and a single default image for all other pages
- [ ] Person structured data on Home and About; Article structured data on Posts (title, dates, author, image)
- [ ] Sitemap lists every generated page and no Drafts; robots file references the sitemap
- [ ] Playwright: every route has canonical and OG/Twitter metadata with a resolvable image; sitemap contains no Draft URLs; structured data parses as valid JSON-LD
- [ ] Lighthouse SEO category ≥ 95 on all checked routes
