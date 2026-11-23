# 09: Discovery and SEO

**What to build:** Everything that makes the site legible to crawlers and feed readers: a sitemap naming the production domain, robots directives pointing at it, canonical URLs and per-page titles and descriptions, link previews for Posts and Projects, a feed of published Posts carrying summaries and links, cookieless analytics, and noindex on preview deployments.

**Blocked by:** 04: Post and Retro, 05: Home composed from real content

**Status:** ready-for-agent

- [ ] The sitemap lists every public route using the production domain and never a preview or demo domain.
- [ ] Robots directives point at the sitemap on the production domain.
- [ ] Every page emits a canonical URL and a title and description derived from its own content.
- [ ] Posts and Projects emit a link preview using the default image plus their own title and summary.
- [ ] The feed lists published Posts only, with summaries and links, and validates as a feed.
- [ ] Analytics is enabled and sets no cookies, so no consent banner is required.
- [ ] Preview deployments emit noindex, verified on an actual preview build.
- [ ] Draft content appears in neither the sitemap nor the feed.
