# 06: Case Studies and Featured Projects

**What to build:** Flagship Projects have a Case Study page covering goals, Stack, features, problems faced and lessons learned, with links to the live site and repository when they exist. Budi marks 2–3 Projects as featured. They appear on Home below the hero and first on the Projects page, and each one always leads to its Case Study. Marking a Project featured without a Case Study fails the build.

Spec: `.scratch/personal-site-v1/spec.md`

**Blocked by:** 05 (Projects page)

**Status:** ready-for-agent

- [ ] A Case Study page is generated for every Project with body content, and only for those
- [ ] Case Study page shows title, summary, Stack, live and repository links (when present) and the long-form content; supports the sections goals, Stack, features, problems, lessons learned
- [ ] The build fails if a featured Project has no Case Study
- [ ] Content query module exposes Featured Projects (newest first)
- [ ] Home shows the Featured Projects section below the hero, each card linking to its Case Study
- [ ] Projects page lists Featured Projects first
- [ ] At least two placeholder flagship Projects with Case Studies exist
- [ ] Vitest: Featured Projects selection and ordering; featured-requires-Case-Study validation
- [ ] Playwright: every Featured Project on Home links to a Case Study page that exists; Case Study pages return 200
- [ ] axe and Lighthouse gates pass with a Case Study added to the checked routes
