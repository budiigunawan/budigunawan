# 03: Project as unit of evidence

**What to build:** Projects as the primary evidence of what Budi has shipped. A Project declares whether it was personal or professional, its Stack, its topic tags, a date, and optionally the Work Entry that produced it, a demo URL, a repository URL and a cover image. `/projects` lists them; each Project detail page renders a fixed narrative — summary, Stack, what was built, impact, links — followed by the free-form body. Magpie exists exactly once, as a professional Project linked to Paragon Corp.

**Blocked by:** 02: Work Entry timeline

**Status:** ready-for-agent

- [x] A Project declares kind (personal or professional), Stack, topic tags and date, and may declare a reference to a Work Entry, a demo URL, a repository URL, a cover image with alt text, and featured and draft flags.
- [x] A missing or malformed required field fails the build naming that field.
- [x] `/projects` lists every published Project newest first, showing its summary, its Stack, and whether it was personal or professional.
- [x] A Project detail page renders summary, Stack, what was built, impact and links, then the free-form body, and the same sections appear in the same order for every Project.
- [x] A Project with no demo URL and no repository URL renders no link affordances and no empty anchors.
- [x] Magpie appears exactly once, as a professional Project referencing the Paragon Corp Work Entry, and the Work Entry links to it.
- [x] Janjiraga and Bambino keep the slugs they have on the current site.
- [x] Professional Projects publish only detail that is already public; no new client internals appear.
- [x] A draft Project appears in neither the index nor a detail route in a production build.
- [x] Project cards and detail pages are readable at 320px, and any cover image carries its alt text.

## Comments

**2026-11-23 — Implemented**

- `src/content.config.ts` declares the `projects` collection. Frontmatter requires `title`, `summary`, `kind` (`personal` or `professional`), `date` (`YYYY-MM-DD`), `stack`, `built` and `impact`, with `workEntry`, `demoUrl`, `repoUrl`, `cover`, `featured` and `draft` optional. Unknown keys are rejected. A cover requires `src`, `alt`, `width` and `height`.
- `src/content/projects/` holds Magpie, Janjiraga and Bambino. Magpie is the single professional Project, references `paragon-corp`, and carries only detail already published on the current site; it has no demo or repository URL. The Cypress coverage metric now lives only in Magpie's impact, not in the Paragon Work Entry. Janjiraga and Bambino keep their existing slugs, and their bodies and cover images are ported from the current site. Janjiraga's demo URL was dropped because `janjiraga.com` no longer resolves; its repository remains.
- `src/lib/content.ts` exposes `getProjects()` (published, newest first), `getProjectWorkEntry()` and `getProjectsByWorkEntry()`. Drafts are filtered when `import.meta.env.PROD` is set, so they render in development but neither the index nor a detail route in a production build. A `workEntry` reference to a missing Work Entry fails the build naming the Project and the referenced id.
- `/projects` lists every published Project newest first with summary, kind and Stack; `/projects/[id]` renders summary, Stack, what was built, impact and links in that order, then the free-form body. The Links section and its buttons are omitted entirely when a Project has neither URL, so Magpie renders no link affordances.
- `/work` renders the Projects that reference each Work Entry, linking Paragon Corp to `/projects/magpie`; project anchors use the Work Entry id.
- `Projects` joins the navigation now that the route exists, and its nav item stays current on detail pages. `src/lib/dates.ts` adds full-date formatting, and `global.css` gives markdown body headings, links and images a style.

Verification: `pnpm check` reports 0 errors and `pnpm build` succeeds with `/projects`, `/projects/janjiraga`, `/projects/bambino` and `/projects/magpie`. A temporary `draft: true` Project rendered in `pnpm dev` at both `/projects` and `/projects/draft-probe`, and was absent from the production build's index and routes; the probe was removed. Malformed content failed the build naming the field: missing `stack`, `2024-02-31` for `date`, `cover` without `alt`, an empty `impact`, and an unknown `workEntry` id. At 320, 768 and 1280px every route had `scrollWidth === clientWidth`, one `h1`, and no image without alt text.
