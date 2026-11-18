# 09: Post reading experience

**What to build:** Reading a Post feels polished. Longer Posts have a table of contents. Code blocks are syntax-highlighted with optional file titles, diff and line highlighting and a copy button, and they follow the light/dark theme. Posts can contain interactive React demos. Each Post ends with 3 related Posts and a link back to the Blog.

Spec: `.scratch/personal-site-v1/spec.md`

**Blocked by:** 08 (Tag pages)

**Status:** ready-for-agent

- [ ] Table of contents built from h2 and h3 headings, shown only when a Post has 3 or more; a sticky sidebar on wide screens and collapsible at the top on narrow screens; entries jump to their section
- [ ] Code blocks: syntax highlighting, optional file title, copy button, diff and line highlighting, dual themes that switch with the site theme without a flash
- [ ] At least one placeholder Post embeds a working interactive React demo, hydrated only where used
- [ ] Content query module exposes related Posts: other published Posts ranked by shared Tag count (descending), then newest first; fills with the latest remaining Posts when fewer than 3 share a Tag; never includes the Post itself or Drafts
- [ ] Post page shows 3 related Posts (or fewer if fewer exist) and a link back to the Blog
- [ ] Vitest: related-Posts ranking, tie-breaking by recency, fill behaviour, self and Draft exclusion
- [ ] Playwright: no Draft appears in related Posts; copy button copies code; TOC appears only on Posts with 3+ headings
- [ ] axe passes on a Post with a TOC, code blocks and a demo, in both themes; Lighthouse gate stays green
