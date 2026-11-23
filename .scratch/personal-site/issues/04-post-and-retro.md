# 04: Post and Retro

**What to build:** The writing surface. A Post is markdown with a title, summary, date and topic tags; `/blog` lists published Posts newest first, `/blog/:slug` renders one with a comfortable reading measure and highlighted, copyable code, and `/retro` lists the Posts tagged retro. Drafts stay out of production. The two theme demo posts are deleted and the first real Post is published.

**Blocked by:** 01: Scaffold, shell and CI

**Status:** ready-for-agent

- [ ] A Post is authored as markdown declaring title, summary, date and topic tags, with optional cover image and alt text, featured flag and draft flag.
- [ ] A missing or malformed required field fails the build naming that field.
- [ ] `/blog` lists published Posts newest first with date, summary and tags.
- [ ] `/blog/:slug` renders a Post at a comfortable reading measure, with syntax highlighting and a copy control on every code block.
- [ ] `/retro` lists the Posts tagged retro, newest first, and a Retro is written exactly like any other Post.
- [ ] A draft Post appears in no index and no route in a production build, while remaining visible in local development.
- [ ] Printing a Post omits navigation, the theme toggle and the footer.
- [ ] The two theme demo posts are deleted, and at least one real Post is published.
- [ ] Tags are displayed but not browsable; no tag route exists.
- [ ] Posts are readable at 320px, and code blocks scroll within their own container rather than the page.
