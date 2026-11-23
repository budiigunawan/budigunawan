# 02: Work Entry timeline

**What to build:** The career timeline, authored as content. A Work Entry is a markdown file declaring company, role and start date, with an optional end date; `/work` lists every Work Entry newest first with company, role and dates, and marks the current role as current rather than inventing an end date. The three real Work Entries — Paragon Corp, PTI and Xtremax — are ported from the current site.

**Blocked by:** 01: Scaffold, shell and CI

**Status:** ready-for-agent

- [ ] A Work Entry is authored as markdown whose frontmatter names company, role and start date, with an optional end date.
- [ ] A missing or malformed required field fails the build with the field named, rather than rendering an incomplete entry.
- [ ] `/work` lists every Work Entry newest first and shows company, role and dates unambiguously, in month-and-year form.
- [ ] The Work Entry with no end date reads as current and never displays a fabricated end date.
- [ ] Paragon Corp, PTI and Xtremax are present with the dates shown on the current site.
- [ ] The Magpie bullets are removed from the Paragon Work Entry; it records employment and responsibilities only.
- [ ] Adding a new markdown file makes it appear on `/work` with no code change.
- [ ] The page has a single h1, and the timeline is readable at 320px.
