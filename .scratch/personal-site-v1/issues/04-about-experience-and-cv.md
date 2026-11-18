# 04: About, Experience and CV

**What to build:** A recruiter can open About and read Budi's bio and an Experience timeline: current roles first, then the rest by start date descending, with ongoing roles shown as "Present". From About and from Home they can open the CV at the stable URL `/cv`, which serves the PDF. Budi updates history by editing small structured Experience entries and updates the CV by replacing one file.

Spec: `.scratch/personal-site-v1/spec.md`

**Blocked by:** 03 (Visual identity and theme)

**Status:** ready-for-agent

- [ ] Experience collection with company, title, start date, optional end date (missing means current), optional location and highlights; invalid entries fail the build
- [ ] Content query module exposes the Experience timeline: current roles first, then by start date descending (handles multiple current roles)
- [ ] About page shows the bio (from the Site profile) and the timeline, each Experience showing company, title, period and highlights; ongoing roles read "Present"
- [ ] A placeholder CV PDF lives in the repo's public assets
- [ ] `/cv` responds with the PDF (PDF content type), and keeps working when the file is replaced
- [ ] CV link on About; the Home CV CTA resolves
- [ ] About appears in navigation
- [ ] Vitest: Experience ordering, including multiple current roles and missing end dates
- [ ] Playwright: About renders the timeline; `/cv` returns a PDF content type
- [ ] axe and Lighthouse gates pass with About added to the checked routes
