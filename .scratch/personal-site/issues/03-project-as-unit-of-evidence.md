# 03: Project as unit of evidence

**What to build:** Projects as the primary evidence of what Budi has shipped. A Project declares whether it was personal or professional, its Stack, its topic tags, a date, and optionally the Work Entry that produced it, a demo URL, a repository URL and a cover image. `/projects` lists them; each Project detail page renders a fixed narrative — summary, Stack, what was built, impact, links — followed by the free-form body. Magpie exists exactly once, as a professional Project linked to Paragon Corp.

**Blocked by:** 02: Work Entry timeline

**Status:** ready-for-agent

- [ ] A Project declares kind (personal or professional), Stack, topic tags and date, and may declare a reference to a Work Entry, a demo URL, a repository URL, a cover image with alt text, and featured and draft flags.
- [ ] A missing or malformed required field fails the build naming that field.
- [ ] `/projects` lists every published Project newest first, showing its summary, its Stack, and whether it was personal or professional.
- [ ] A Project detail page renders summary, Stack, what was built, impact and links, then the free-form body, and the same sections appear in the same order for every Project.
- [ ] A Project with no demo URL and no repository URL renders no link affordances and no empty anchors.
- [ ] Magpie appears exactly once, as a professional Project referencing the Paragon Corp Work Entry, and the Work Entry links to it.
- [ ] Janjiraga and Bambino keep the slugs they have on the current site.
- [ ] Professional Projects publish only detail that is already public; no new client internals appear.
- [ ] A draft Project appears in neither the index nor a detail route in a production build.
- [ ] Project cards and detail pages are readable at 320px, and any cover image carries its alt text.
