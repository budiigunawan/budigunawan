# Spec: Personal site v1 (budigunawan.com)

Status: ready-for-agent

## Problem Statement

Budi Gunawan is a fullstack engineer focused on frontend. There is nowhere online that presents who Budi is, Budi's work history, the Projects Budi has built, and Budi's writing in one place. Recruiters, hiring managers and fellow engineers have to piece this together from LinkedIn, GitHub and scattered links. For a frontend-heavy engineer, that fragmented presence also wastes the best evidence of skill: a fast, accessible, well-crafted site is itself a portfolio piece.

## Solution

A personal branding site at budigunawan.com, built with Astro as a fully static site and hosted on Cloudflare. It has four core areas:

- **Home**: introduces Budi and leads to the strongest work.
- **About**: holds the bio, the Experience timeline and a link to the CV.
- **Projects**: shows every Project as a card. Flagship Projects open a Case Study.
- **Blog**: publishes Posts written as MDX in the repo, with Tags, a table of contents, polished code blocks and generated social images.

The site has its own visual identity in a minimal editorial style with tasteful motion. It supports light and dark themes and launches only when it meets a measurable quality bar: WCAG 2.1 AA, Lighthouse ≥ 95 in every category on mobile, and zero layout shift.

## User Stories

### Visitor: first impression (Home)

1. As a recruiter, I want the Home page to tell me Budi's name, role and a one-line pitch immediately, so that I know within seconds whether Budi fits what I'm hiring for.
2. As a recruiter, I want a clear call to action on Home that opens the CV, so that I can get the document I need for my hiring process without hunting for it.
3. As a hiring manager, I want a call to action on Home that takes me to Projects, so that I can judge the quality of Budi's work quickly.
4. As a recruiter, I want a call to action on Home that shows me how to contact Budi, so that I can reach out right away.
5. As a hiring manager, I want to see 2–3 Featured Projects on Home, so that I see Budi's best work without browsing the full list.
6. As a hiring manager, I want every Featured Project on Home to lead to a Case Study, so that clicking a highlight always gives me in-depth content rather than a bare external link.
7. As a fellow engineer, I want to see the 3 latest Posts on Home, so that I can tell Budi writes actively and jump into recent writing.
8. As a visitor, I want the latest-Posts section on Home to be absent when no Posts are published, so that the site never shows an empty or "coming soon" section.

### Visitor: About and Experience

9. As a recruiter, I want an About page with a short bio, so that I understand Budi's background and what drives Budi's work.
10. As a recruiter, I want the About page to list Budi's Experience as a timeline, so that I can see career progression at a glance.
11. As a recruiter, I want each Experience to show company, title, period and highlights, so that I can assess the relevance of each role.
12. As a recruiter, I want the current role shown first and the rest in reverse chronological order, so that the most relevant information comes first.
13. As a recruiter, I want an ongoing role to read as "Present" instead of an end date, so that I know Budi's current status.
14. As a recruiter, I want a link from About to the CV, so that I can download it from where I'm reading about Budi's history.

### Visitor: CV

15. As a recruiter, I want to open the CV at a short, stable URL (budigunawan.com/cv), so that links saved in my ATS, emails or LinkedIn keep working after Budi updates the CV.
16. As a recruiter, I want the CV served as a PDF, so that I can download it, print it or attach it to a candidate record.

### Visitor: Projects

17. As a hiring manager, I want a Projects page listing every Project as a card, so that I can see the breadth of Budi's work.
18. As a hiring manager, I want Featured Projects listed first on the Projects page, so that I see the strongest work before the rest.
19. As a hiring manager, I want the remaining Projects ordered newest first, so that I see Budi's most recent skills.
20. As a hiring manager, I want each Project card to show its title, a short summary and its Stack, so that I can tell what it is and what it was built with without opening it.
21. As a hiring manager, I want a Project card that has a Case Study to open the Case Study on the site, so that I can read the full story.
22. As a fellow engineer, I want a Project card without a Case Study to link to its repository or live site, so that I can still explore it.
23. As a hiring manager, I want a Case Study to cover goals, Stack, features, problems faced and lessons learned, so that I can judge how Budi thinks, not only what Budi shipped.
24. As a hiring manager, I want a Case Study to link to the live site and repository when they exist, so that I can verify the work myself.
25. As a visitor, I want links that leave the site to be visually distinguishable, so that I know when I'm being taken elsewhere.

### Visitor: Blog and Posts

26. As a fellow engineer, I want a Blog index listing all published Posts newest first, so that I can browse Budi's writing.
27. As a fellow engineer, I want each Post in the Blog index to show its title, description, publish date, reading time and Tags, so that I can decide what to read.
28. As a fellow engineer, I want each Tag to have its own page listing the Posts with that Tag, so that I can read everything Budi has written on one topic.
29. As a fellow engineer, I want Tag pages to have shareable, stable URLs, so that I can send someone "all of Budi's Posts about X".
30. As a fellow engineer, I want the Blog index to link to every Tag page, so that I can discover topics.
31. As a reader, I want a Post to show its title, publish date, last-updated date (if any), reading time and Tags, so that I know how fresh and how long it is.
32. As a reader, I want a table of contents on longer Posts, so that I can see the structure and jump to the section I need.
33. As a reader, I want code blocks with syntax highlighting, optional file titles, diff and line highlighting, and a copy button, so that code examples are easy to read and reuse.
34. As a reader, I want code blocks to match the current light/dark theme, so that switching theme doesn't leave jarring blocks.
35. As a reader, I want Posts to be able to contain interactive demos, so that frontend concepts are shown, not just described.
36. As a reader, I want 3 related Posts at the end of each Post, so that I can keep reading on similar topics.
37. As a reader, I want a link back to the Blog at the end of a Post, so that I can continue browsing.
38. As a reader, I want to subscribe to an RSS feed, so that new Posts reach me in my feed reader.
39. As someone sharing a Post on social media, I want a generated preview image with the Post's title, so that the link stands out in feeds.
40. As a visitor, I want the Blog link hidden from navigation while no Posts are published, so that I never land on an empty Blog.

### Visitor: navigation, theme, and contact

41. As a visitor, I want consistent navigation to Home, About, Projects and Blog on every page, so that I can always get anywhere in one click.
42. As a visitor, I want the current section marked in the navigation, so that I know where I am.
43. As a visitor, I want the site to follow my system light/dark preference by default, so that it matches my environment.
44. As a visitor, I want a toggle to switch theme manually and have it remembered on later visits, so that my choice sticks.
45. As a visitor, I want no flash of the wrong theme while a page loads, so that the site feels polished.
46. As a visitor, I want the email address, GitHub and LinkedIn in the footer, so that I can contact Budi or look at other profiles from any page.
47. As a visitor who lands on a missing URL, I want a helpful 404 page with links back into the site, so that I'm not stranded.

### Visitor: accessibility and performance

48. As a keyboard user, I want a "skip to main content" link and a visible focus state on every interactive element, so that I can navigate efficiently.
49. As a screen reader user, I want proper landmarks, heading order, link names and image alt text, so that I can understand and move through every page.
50. As a visitor with low vision, I want text and UI colours to meet WCAG AA contrast in both themes, so that I can read everything.
51. As a visitor who prefers reduced motion, I want animations reduced or removed, so that motion doesn't cause discomfort.
52. As a mobile visitor, I want pages to load fast and not jump around while loading, so that the site is comfortable on a phone.
53. As a visitor on any screen size, I want the layout to work from small phones to wide desktops without horizontal scrolling, so that I can read comfortably.

### Search engines and social platforms

54. As a search engine, I want a sitemap, robots file and canonical URLs on budigunawan.com, so that I index the right pages.
55. As a search engine, I want structured data describing Budi as a Person and each Post as an Article, so that results can be shown richly.
56. As a social platform, I want Open Graph and Twitter card metadata on every page, with a sensible default image for pages without their own, so that every shared link previews well.

### Budi: authoring and maintenance

57. As Budi, I want to write a Post as an MDX file in the repo, so that writing uses the same editor, git history and review flow as the code.
58. As Budi, I want to mark a Post as a Draft, so that I can commit work in progress without publishing it.
59. As Budi, I want Drafts visible and clearly marked when running the site locally, so that I can preview them while writing.
60. As Budi, I want Drafts excluded from every production output (pages, Tag pages, Home, RSS, sitemap, related Posts), so that unfinished writing never leaks.
61. As Budi, I want the Blog link and Home's latest-Posts section to appear automatically when I publish my first Post, so that I don't have to change layout code.
62. As Budi, I want the build to fail if a Post is missing required fields (title, description, publish date), so that I can't publish a broken Post.
63. As Budi, I want the build to fail if a Project is marked featured but has no Case Study, so that the Featured Project rule can't be broken by accident.
64. As Budi, I want to add a Project with just a few fields (title, summary, Stack, date, links), so that small Projects are quick to list.
65. As Budi, I want to add a Case Study by writing long-form content for a Project, so that flagship Projects get in-depth pages.
66. As Budi, I want to add or edit an Experience as a small structured entry, so that updating my history is quick and the timeline stays consistent.
67. As Budi, I want to update the CV by replacing one file in the repo, so that the /cv URL always serves the newest version.
68. As Budi, I want Tags with different casing ("React" and "react") treated as the same Tag, so that topics don't split.
69. As Budi, I want site-wide profile details (name, role, pitch, email, social URLs) defined in one place, so that changing them updates every page.
70. As Budi, I want every push to main to deploy to production automatically, so that publishing is just merging.
71. As Budi, I want every branch to get a preview URL, so that I can review changes and Drafts-in-progress before merging.
72. As Budi, I want automated tests and the Lighthouse gate to run on every pull request, so that I can't regress quality.
73. As Budi, I want privacy-friendly analytics on production, so that I can see which pages and Posts get attention without a cookie banner.
74. As Budi, I want the source in a public GitHub repo, so that the code is part of my portfolio.
75. As Budi, I want the local issue tracker kept out of the public repo, so that private planning stays private.

## Implementation Decisions

### Platform and delivery

- Astro with fully static output. There's no server rendering, no Workers functions and no database in v1.
- React is the islands framework. Use islands only where interactivity is needed: the theme toggle, interactive demos inside Posts, and motion that needs JS.
- Tailwind CSS v4 handles styling. Design tokens (colour palettes for light and dark, type scale, spacing, radii, motion durations) are defined once as the Tailwind theme. Light and dark palettes must both meet WCAG AA contrast.
- Hosting is Cloudflare Workers with static assets.
  - Deploys come from Cloudflare Workers Builds connected to a public GitHub repo: `main` deploys to production and other branches get preview URLs.
  - The custom domain is budigunawan.com, whose DNS is already on Cloudflare. `www` redirects to the apex domain.
- The `.scratch/` directory is gitignored.
- Cloudflare Web Analytics is loaded on production only.

### Content model (Astro content collections, all in repo)

- **Posts** are MDX. Frontmatter fields:
  - title (required)
  - description (required)
  - publish date (required)
  - updated date (optional)
  - Tags (a list of strings)
  - draft flag (defaults to false)
  - optional hero image
- **Projects** are MDX, one entry per Project. Frontmatter fields:
  - title
  - summary
  - Stack (a list of technology names)
  - date, used for ordering
  - optional repository URL
  - optional live URL
  - featured flag

  A Project has a Case Study exactly when its entry has body content. The schema fails the build if a featured Project has no Case Study, or if a Project has neither a Case Study nor at least one external link.
- **Experience** entries are structured data, not long-form. Fields:
  - company
  - title
  - start date
  - end date (optional; missing means current)
  - optional location
  - highlights (a short list)
- **Site profile** is a single structured source with name, role, one-line pitch, bio summary, email, GitHub URL, LinkedIn URL, canonical site URL and default social image.
- **CV** is a single PDF file in the repo's public assets.
- Tags are normalised to a lowercase slug for identity and URLs. The display label is the first-seen casing.

### Content query module (the one deep module pages use to read content)

Every page and endpoint reads content through this module, never directly from the collections. It takes the raw collection entries plus a mode (production or development) and exposes:

- **Published Posts**: Posts sorted newest first. Drafts are excluded in production and included (flagged) in development.
- **Blog visibility**: true when at least one published Post exists. It drives the nav link, Home's latest-Posts section and whether Blog routes and RSS are generated.
- **Latest Posts (n)**: the first n published Posts.
- **Tags**: every Tag that appears on a published Post, each with its slug, label and Post count.
- **Posts for a Tag (slug)**: the published Posts carrying that Tag, newest first.
- **Related Posts (Post, n = 3)**: other published Posts ranked by number of shared Tags (descending), then newest first. If fewer than n share a Tag, it fills with the latest remaining Posts. The given Post is never included.
- **Reading time (Post)**: whole minutes at about 200 words per minute, rounded up, minimum 1.
- **Featured Projects**: Projects with the featured flag, newest first. All of them are guaranteed to have a Case Study.
- **Projects in display order**: Featured Projects first, then the rest newest first.
- **Project link target**: the internal Case Study URL when one exists, otherwise the live URL, otherwise the repository URL.
- **Experience timeline**: current roles first, then by start date descending.

The module is pure: given entries and mode, it returns data. The thin adapter that calls Astro's collection loader is the only part that isn't pure.

### Routes

| Route | Content |
|---|---|
| `/` | Hero (name, role, pitch, CTAs to Projects, `/cv`, and contact), then Featured Projects, then latest 3 Posts (only when the Blog is visible) |
| `/about` | Bio, Experience timeline, CV link |
| `/projects` | All Projects in display order |
| `/projects/<slug>` | Generated only for Projects with a Case Study |
| `/blog` | Blog index |
| `/blog/<slug>` | Post |
| `/blog/tags/<tag-slug>` | Tag page |
| `/rss.xml` | Feed of published Posts with title, description, date and link |
| `/cv` | Serves the CV PDF |
| `/404` | Not-found page |
| sitemap, robots | Generated |

Every `/blog` route and `/rss.xml` is generated only when the Blog is visible.

### Post features

- **Table of contents** is built from h2 and h3 headings and shown when a Post has 3 or more such headings. It's a sticky sidebar on wide screens and collapsible at the top on narrow screens.
- **Code blocks** use a highlighter that supports file titles, a copy button, diff and line highlighting, with dual themes that follow the site theme.
- **OG images** are generated at build time, one 1200×630 image per Post with its title and site branding. Every other page uses a single default branded image.
- Posts can embed React components for interactive demos.

### Theme and motion

- The theme resolves in this order: the stored user choice, then the system preference. An inline script in the document head applies it before first paint, so there's no flash.
- The toggle stores the choice persistently. If storage fails, the toggle still works for the session.
- All motion respects `prefers-reduced-motion`.

### SEO and metadata

- Canonical URLs use https://budigunawan.com.
- Open Graph and Twitter card metadata on every page.
- Person structured data on Home and About; Article structured data on Posts.

### Performance and layout stability

- Fonts are self-hosted and preloaded, with metric-matched fallbacks.
- Images use Astro's image pipeline with explicit dimensions.
- No client JS ships on pages that need none beyond the theme script.
- Target: zero cumulative layout shift.

## Testing Decisions

### What makes a good test here

Tests assert externally observable behaviour: what a visitor sees at a URL, what the feed contains, what the content module returns for given entries. They never assert on component internals, CSS class names, or how a page assembles its data. Changing implementation without changing behaviour should break no tests.

### Seam 1: the built site (primary)

Build the site, serve it with Astro's preview server, and drive it with Playwright. Assertions run against the real content in the repo and are written as invariants that stay true as content grows:

- Every route in the route table returns 200 when it should exist, and `/404` renders for unknown URLs.
- No Draft appears anywhere in production output: pages, Tag pages, Home, RSS, sitemap, related Posts.
- RSS is valid XML and lists exactly the published Posts.
- Every Tag page lists only Posts with that Tag.
- Every Featured Project on Home links to a Case Study page that exists.
- Project cards without a Case Study link externally.
- `/cv` responds with a PDF content type.
- The theme toggle switches theme and persists across reload. With no stored choice, the theme follows an emulated system preference. There's no wrong-theme flash on load.
- Navigation marks the current section, and the skip link moves focus to main content.
- axe reports zero violations on every route, in both light and dark themes.
- With reduced motion emulated, animations are disabled.

**Lighthouse CI** runs against the same preview on the key routes (Home, About, Projects, a Case Study, Blog, a Post) with a mobile profile. It's a gate: every category ≥ 95 and CLS = 0.

### Seam 2: the content query module

Vitest unit tests feed the pure module fixture entries. These cover rules that depend on content state the real site can't reproduce on demand:

- Drafts excluded in production mode and included in development mode.
- Blog visibility false with zero published Posts (including when only Drafts exist) and true otherwise.
- Posts sorted newest first; latest n.
- Tag collection: case-insensitive merging, slugs, counts; Tags only from published Posts.
- Posts for a Tag.
- Related Posts: ranked by shared Tags, then recency; fills with latest Posts when there are too few matches; never includes the Post itself; never includes Drafts.
- Reading time rounding and minimum.
- Featured Projects and Project display order.
- Project link target precedence.
- Experience ordering, including multiple current roles.

### Content schema rules

The schema rules (featured requires a Case Study, a Project needs a Case Study or a link, required Post fields) are enforced at build time. They're covered by the content module tests where the rule is expressible as a validation function, and otherwise by the build failing.

### CI

GitHub Actions runs the Vitest tests, the Playwright suite and the Lighthouse gate on every pull request. Branch protection on `main` requires them to pass before merge. Cloudflare Workers Builds handles deployment separately.

### Prior art

None. The repo is greenfield, so these suites establish the conventions.

## Out of Scope

- Extra sections from the reference site: Shorts, Guestbook, Uses, Statistics, Photos, Bucket List, Book Notes, Mentorship.
- Sanity or any other headless CMS (see ADR-0001).
- View counts, likes, reactions, comments, or any server-backed feature (no Workers functions, D1 or KV).
- Newsletter signup.
- A contact form.
- Languages other than English.
- Client-side Tag filtering on the Blog index, and Stack filtering on the Projects page.
- Site search and a command palette.
- Generating the CV from site data; the CV is a separately maintained PDF.
- Social links other than GitHub and LinkedIn.
- Post series.

## Further Notes

- Vocabulary follows `GLOSSARY.md`: Post, Draft, Tag, Project, Stack, Case Study, Featured Project, Experience, CV.
- ADR-0001 records why Posts are MDX in the repo rather than Sanity.
- The visual identity is designed within this project; it isn't copied from the reference site (theodorusclarence.com). The direction is minimal editorial with tasteful motion.
- Content Budi must supply before launch (not blocking implementation, since placeholder content is fine during the build):
  - the public email address
  - GitHub and LinkedIn URLs
  - the CV PDF
  - Experience entries
  - the 2–3 flagship Projects with Case Studies, plus other Projects
  - any Posts
- The site can launch with zero Posts; the Blog appears automatically with the first published Post.
