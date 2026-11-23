# 02: Work Entry timeline

**What to build:** The career timeline, authored as content. A Work Entry is a markdown file declaring company, role and start date, with an optional end date; `/work` lists every Work Entry newest first with company, role and dates, and marks the current role as current rather than inventing an end date. The three real Work Entries — Paragon Corp, PTI and Xtremax — are ported from the current site.

**Blocked by:** 01: Scaffold, shell and CI

**Status:** ready-for-agent

- [x] A Work Entry is authored as markdown whose frontmatter names company, role and start date, with an optional end date.
- [x] A missing or malformed required field fails the build with the field named, rather than rendering an incomplete entry.
- [x] `/work` lists every Work Entry newest first and shows company, role and dates unambiguously, in month-and-year form.
- [x] The Work Entry with no end date reads as current and never displays a fabricated end date.
- [x] Paragon Corp, PTI and Xtremax are present with the dates shown on the current site.
- [x] The Magpie bullets are removed from the Paragon Work Entry; it records employment and responsibilities only.
- [x] Adding a new markdown file makes it appear on `/work` with no code change.
- [x] The page has a single h1, and the timeline is readable at 320px.

## Comments

**2026-11-23 — Implemented**

- `src/content.config.ts` declares the `work` collection. Frontmatter requires `company`, `role` and `start`, with an optional `end`; dates must be `YYYY-MM`, are parsed as UTC, and an end before the start is rejected. Unknown keys are rejected too, so a misspelled optional field cannot silently turn a completed role into a current one.
- `src/content/work/` holds Paragon Corp (Sep 2023 – present), Xtremax (Oct 2022 – Aug 2023) and Paragon Technology Innovation (Sep 2020 – Sep 2022). The two Magpie bullets are gone from Paragon Corp; the Work Entry records employment facts and responsibilities only.
- `src/lib/content.ts` exposes `getWorkEntries()` sorted newest start date first. `src/lib/dates.ts` formats month-and-year labels and `<time datetime>` values in UTC so a date cannot shift month. `WorkEntryDates.astro` renders the range and marks an open role as `Present` plus a `Current` badge, never a fabricated end date.
- `/work` renders a single `h1` and a semantic ordered list; `Work` is now in the navigation because the route exists. README documents the content format and new modules.

Verification: `pnpm check` reports 0 errors and `pnpm build` succeeds. Malformed or missing fields fail the build naming the field — tested with a missing `company`, a missing `start`, a numeric `start`, `2023-9`, `2023-09-15`, `Sept 2023`, an empty `end:`, and a misspelled `End:`. A temporary markdown file appeared first on `/work` with no code change and was then removed. At 320px the page's `scrollWidth` equals its `clientWidth` (320), the page has one `h1`, and no Magpie mentions remain in the built Paragon entry.
