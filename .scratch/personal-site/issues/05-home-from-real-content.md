# 05: Home composed from real content

**What to build:** The landing page, assembled from the real collections: hero, a short about, three featured Projects, three latest Posts, and the contact call to action, in that order. Featured items come from an explicit flag, and when fewer than three are flagged the newest unflagged items fill the remaining slots so no section renders a gap. Availability is stated as one line inside the about; there is no banner.

**Blocked by:** 02: Work Entry timeline, 03: Project as unit of evidence, 04: Post and Retro

**Status:** ready-for-agent

- [x] Home renders hero, about, three featured Projects, three latest Posts and a contact call to action, in that order.
- [x] When fewer than three items are flagged featured, the newest unflagged items fill the remaining slots.
- [x] When fewer than three items exist at all, the section renders what exists with no empty or placeholder cards.
- [x] Every link on the home page resolves to a route that exists.
- [x] Availability appears as a single line in the about section, with no badge, banner or status pill.
- [x] A visitor can tell who Budi is, what he builds, and how to reach him from the first screen at both 1440x900 and 390px.

## Comments

**2026-11-24 — Implemented**

- `src/lib/content.ts` gains `getFeaturedProjects()` and `getFeaturedPosts()`, both returning three entries. A shared `selectFeatured` takes the flagged entries first, then the newest unflagged ones, caps the result at `HOME_FEATURED_COUNT` and orders it newest first, so a flagged entry always keeps its slot even when older than an unflagged one it displaces. The result is a new array, so the collection-level ordering the other pages rely on is untouched.
- `/` now reads the real collections: hero, About, featured Projects, latest Posts and the contact call to action, in that order. `ProjectCard` and `PostList` take an optional `headingLevel`, so their titles render as `h3` beneath each section's `h2`; their existing callers on `/projects` and `/blog` keep the default `h2`. `SectionHeading` owns the section heading row so the four sections cannot drift apart in type or spacing.
- The Projects and Writing sections render only when their query returns at least one entry, so a collection with nothing published leaves no empty frame or placeholder card behind. Each section links to its full index at the heading. `PostList` no longer draws the rule that opens its list; `/blog` and `/retro` supply it, matching how `/projects` wraps `ProjectCard`, so the Writing section shows one rule rather than two.
- Availability is one sentence inside About, in ordinary body text: no badge, banner or status pill. The contact call to action closes the page with the email address as its single button; socials stay in the footer, as the spec requires. `Email me` in the hero repeats the address on the first screen, and `/work` is the secondary hero action. The CTA is a `mailto:` for now because `/contact` does not exist yet; ticket 08 repoints it. `site.email` is the one place the address is written, and the `mailto:` href is derived from it.
- Every link on `/` resolves: `/work`, `/projects`, `/blog`, each Project detail, the one Post, and the mailto and social links. No `/contact` or Resume link is added before those routes exist.
- The placeholder line about the site being rebuilt is gone, and the About copy names the work he has actually done. `README.md` documents the featured-fill rule and the home page's composition.
- Posts follow the Content model's explicit `featured` flag rather than the Routes section's "three latest Posts", the same rule as Projects: a flagged Post keeps a slot, and newest-first fills the rest. The two spec lines disagree; the Content model rule is the one the home page implements.

Verification: `pnpm check` reports 0 errors, 0 warnings and 0 hints, and `pnpm build` succeeds with 10 pages. The built `/index.html` contains `h1` tagline, then `h2` About, Projects, Writing and Get in touch, with Project and Post titles at `h3`; a script resolved every internal `href` in it to a file in `dist/` with none missing. The Projects section shows Janjiraga, Bambino and Magpie; the Writing section shows the single Post, one card with no gap or placeholder. In `pnpm dev`, a temporary unflagged Project dated 2026-01-02 stayed off the home page while three unflagged entries were flagged, then two temporary unflagged Posts dated 2026-11-29 and 2026-11-30 filled the slots beside the flagged Post, and a third dated 2026-12-01 displaced the oldest unflagged one while the flagged Post kept its slot; all probes were removed. At 1440x900 the name, tagline, description and `Email me` sit above the fold with About beginning at 715px, and at 390x844 the same holds with `Email me` ending at 584px and About at 674px; neither viewport scrolls horizontally (`scrollWidth === clientWidth`).
