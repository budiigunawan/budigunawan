# Personal Site — budigunawan.com v2

Status: ready-for-agent

## Problem Statement

The site at `www.budigunawan.com` is not the site Budi intended to publish. It is a fork of the `astro-sphere` theme, deployed to production, still carrying the theme's identity rather than his own: its sitemap in production points at `astro-sphere-demo.vercel.app`, its nav has the Blog link commented out, and its `/contact` route 404s even though the home page invites visitors to get in touch. A recruiter who follows the only call to action on the page hits a dead end.

Three further problems come from that starting point:

1. **The blog was announced and never shipped.** The site's own README promised "thoughts, web development tips, and self-help book summaries". The two posts in the repo are the theme's demo posts. There is no writing surface, so Budi has no place to build an audience and no artefact showing how he thinks.
2. **The same work is described twice, inconsistently.** Magpie appears both as a Paragon Corp responsibility and as a standalone project card, with no link between them. A reader cannot tell whether they are the same thing, and the two framings will drift as each is edited.
3. **Nothing on the site runs.** Every page is prerendered, so there is no proof of backend ability — the exact skill Budi is trying to demonstrate as he moves from frontend toward fullstack.

The Resume is also a Google Drive link, which means a third-party viewer sits between a recruiter and the CV, and the nav link dies if the file ever moves.

## Solution

Rebuild `budigunawan.com` as a new Astro 5 site in a new repository, with hand-written components instead of a theme fork, replacing the theme's identity with a typography-led editorial design.

The content is markdown in git, modelled on the three things the site actually publishes: Work Entries (a career timeline), Projects (the unit of evidence, personal or professional), and Posts (technical or personal, with Retro as a kind of Post). The Resume stays a PDF — edited in Google Drive, published as a copy on the site so the link cannot rot.

Exactly one part of the site runs on a server: the Contact form. A visitor's Contact Message is validated, stored in Postgres, and emailed to Budi. That single write path is also the vehicle for the fullstack practice the site is meant to demonstrate — deploy, database, API contract, secrets, spam, and failure handling, end to end.

The result is a site a recruiter can act on in under a minute (who, what shipped, how to reach him) and a site Budi can publish writing on without touching code for anything but content.

## User Stories

### A recruiter or hiring manager

1. As a recruiter, I want the home page to tell me who Budi is and what he builds within one screen, so that I can decide whether to keep reading.
2. As a recruiter, I want a single click to reach a downloadable Resume, so that I can attach it to an application without hunting through links.
3. As a recruiter, I want the Resume to be served from Budi's own domain, so that I am not asked to sign in to a third-party viewer.
4. As a recruiter, I want to see where Budi has worked and for how long, in date order, so that I can check continuity and seniority at a glance.
5. As a recruiter, I want each Work Entry to state the role, the company, and the dates unambiguously, including which role is current, so that there is no guesswork about his present situation.
6. As a recruiter, I want the impact of each Work Entry in concrete terms, so that I can judge the scale he has worked at.
7. As a hiring manager, I want to browse Projects and see the Stack for each one, so that I can assess technology fit without opening every project.
8. As a hiring manager, I want to know whether a Project was personal or shipped professionally, so that I can weigh it appropriately.
9. As a hiring manager, I want a professional Project to link back to the Work Entry that produced it, so that I can understand the context it was built in.
10. As a hiring manager, I want a Project detail page with a consistent narrative — summary, Stack, what was built, impact, links — so that I can compare projects without re-learning a new layout each time.
11. As a hiring manager, I want a link to a live demo or repository where one exists, so that I can verify the work rather than take it on trust.
12. As a recruiter, I want to contact Budi from the site and receive confirmation that the message was accepted, so that I know it was not silently dropped.
13. As a recruiter, I want the Contact form to ask only for what is needed, so that I can send a message in seconds.

### An engineer or reader

14. As a reader, I want to browse published Posts newest first, so that I can find recent writing.
15. As a reader, I want each Post to show its date, summary, and topics, so that I can decide whether it is worth my time.
16. As a reader, I want to read a Post at a stable URL with comfortable measure and readable code blocks, so that long technical reading is not tiring.
17. As a reader, I want a Retro index listing Budi's yearly retrospectives in reverse chronological order, so that I can follow his progress year over year.
18. As a reader, I want to subscribe via RSS, so that I can follow new writing without checking the site.
19. As a reader, I want the site to work with JavaScript disabled, so that I can read everything regardless of what my browser blocks.
20. As a reader, I want to switch between light and dark appearance, and to have my system preference respected by default, so that the site is comfortable in either setting.
21. As a reader using a screen reader or keyboard, I want every page to be navigable and every control operable without a mouse, so that I can use the site at all.
22. As a reader landing on a URL that no longer exists, I want a useful 404 page with links back into the site, so that I am not stranded.

### Budi as author

23. As the author, I want to add a Post by creating a markdown file with frontmatter, so that publishing is a commit and not a CMS session.
24. As the author, I want a Post marked as a draft to be excluded from the build, the index, and RSS, so that unfinished writing cannot be published by accident.
25. As the author, I want `retro` to be a tag on a Post rather than a separate content type, so that a Retro is written exactly like any other Post.
26. As the author, I want to add a Project by creating a markdown file and declaring its `kind` as personal or professional, so that the classification is explicit rather than buried in prose.
27. As the author, I want to declare a Project's Stack separately from its topic tags, so that "TypeScript" does not sit in the same list as "e-commerce".
28. As the author, I want a professional Project to reference the Work Entry that produced it by name, so that Magpie is described once and linked from both places.
29. As the author, I want a Project with no live demo or public repository to be representable without empty links, so that client work can be listed honestly.
30. As the author, I want to mark selected Projects and Posts as featured, so that the home page shows the ones I chose rather than whatever is newest.
31. As the author, I want invalid frontmatter to fail the build with a named field, so that I find out before deploying rather than on the live site.
32. As the author, I want pagination-free browsing on the index pages for as long as the collection is small, so that there is nothing to configure.

### Budi as operator

33. As the operator, I want every new Contact Message to arrive in my email inbox, so that I do not have to poll a dashboard.
34. As the operator, I want a Contact Message to be stored even if the email fails to send, so that no enquiry is lost because a mail provider had a bad minute.
35. As the operator, I want obvious bot submissions rejected before they reach the database, so that my inbox is not polluted by spam.
36. As the operator, I want a single sender to be unable to flood me, so that one bad actor cannot exhaust the mail quota.
37. As the operator, I want the site's sitemap to name the real domain, so that search engines index `budigunawan.com` rather than a demo URL.
38. As the operator, I want page-view analytics without a cookie banner, so that I can see what is read without asking visitors to consent.
39. As the operator, I want the previous version of the site to remain reachable at a subdomain, so that I can compare the rebuild against it after launch.
40. As the operator, I want the apex domain to move to the new deployment without a redirect chain, so that links already in circulation keep resolving.
41. As the operator, I want secrets — the database URL, the mail key, the admin password hash, the session secret — to live only in environment configuration, so that no credential enters the repository.
42. As the operator, I want a failed deployment to be catchable before it reaches production, so that the site is never served from a broken build.

### A future maintainer

43. As a maintainer, I want the content schema to be the single authority on what a Work Entry, Project, and Post are, so that I do not have to infer shape from examples.
44. As a maintainer, I want the Contact endpoint's contract written down, so that I can change the client and server without guessing.
45. As a maintainer, I want the reason this site is static except for one route recorded, so that I do not "fix" it by making everything server-rendered.
46. As a maintainer, I want the reason a Project and a Work Entry are separate concepts recorded, so that I do not reintroduce the duplication.

## Implementation Decisions

### Stack and shape

- Astro 5, TypeScript in strict mode, Tailwind 4, pnpm. The Vercel adapter is installed but every page is prerendered; only the Contact endpoint (and, later, the admin view) opts out.
- A new repository takes the name `budigunawan.com`; the existing repository is renamed `budigunawan.com-v1` and keeps its own Vercel project, serving `v1.budigunawan.com`.
- Components are hand-written, not inherited from `astro-sphere`. Nothing from the theme's component layer is reused; only its markdown content is ported.

### Content model

- Four content collections, all markdown, loaded through the content layer:
  - **Work Entry** — company, role, start date, end date (absent means current), body describing responsibilities.
  - **Project** — title, one-line summary, `kind` (personal or professional), optional reference to the Work Entry that produced it, `stack` list, topic `tags` list, date, optional demo URL, optional repository URL, `featured` flag, `draft` flag, free-form body.
  - **Post** — title, summary, date, topic `tags` list, `featured` flag, `draft` flag, free-form body. Retro is a tag, not a collection.
  - **Legal** — title, date, body.
- `kind`, `stack`, and `tags` are three distinct axes. Language and framework names belong in `stack`; subject matter belongs in `tags`. The previous string "A Personal project" disappears from tags entirely.
- Magpie becomes exactly one professional Project referencing Paragon Corp. It is removed as a Work Entry bullet, and the Work Entry keeps only employment facts and responsibilities.
- Markdown only. MDX is out of scope in v1.

### Routes

- Home, Work index, Projects index, Project detail, Blog index, Post detail, Retro index, Contact, Privacy, 404, RSS feed, sitemap, robots, and a Resume PDF served as a static file.
- Home composition is fixed: hero, short about, three featured Projects, three latest Posts, contact call to action.
- Project detail uses fixed narrative sections — summary, Stack, what was built, impact, links — followed by the free-form body. Projects without external links render no link affordances.
- `/contact` replaces a route that currently 404s.
- Navigation is Home, Work, Projects, Blog, Resume (external file), Contact; socials live in the footer.

### Contact endpoint

- `POST /api/contact` accepts JSON with name, email, and message, plus a honeypot field that must be empty.
- Validation: name and email required and non-empty, email syntactically valid, message required with a sane minimum and maximum length. Violations return a 400 with a field-level error body.
- A filled honeypot returns a success response without writing anything — bots get no signal.
- Rate limiting is per client, keyed by a hash of the IP address, enforced against the database over a rolling window. Exceeding it returns 429.
- On success the Contact Message is persisted first, then a notification is sent through the mail provider. A mail failure is logged and does not fail the request; the response is still a success because the message is stored.
- Responses are JSON with a stable shape, and the endpoint never leaks internal error detail to the client.
- The handler reaches the database and the mail provider through two narrow ports that are injected, so tests substitute fakes. Neither is referenced directly from the route.

### Admin (deferred)

- The admin list view is v1.1, not v1. Its authentication design is fixed now so the endpoint's storage does not need to change: a single password whose hash lives in environment configuration, exchanged for a signed HttpOnly cookie. No OAuth.

### Design

- Typography-led editorial: serif display headings, neutral sans for body text, monospace for code.
- Light and dark themes, following the system preference with a manual override that persists.
- Motion limited to hover and enter transitions. No scroll-jacking.
- One accent colour, chosen during implementation.

### Discovery and operations

- Vercel Web Analytics, which is cookieless and needs no banner.
- Canonical URLs, a default Open Graph image, a correct sitemap naming `budigunawan.com`, robots directives, and an RSS feed listing published Posts only.
- Analytics and sitemap must not advertise the preview or demo domain under any configuration.
- DNS stays at Cloudflare; the new Vercel project claims both apex and `www`.

### Content and copy

- Blog ships with at least one real Post. The two theme demo posts are deleted and never ported.
- A Privacy page states that Contact Messages are stored, what they contain, and who can read them.
- No "open to work" banner. Availability is a line in the about section.
- No testimonials section.

## Testing Decisions

A good test here asserts externally observable behaviour: a request produces a status and a body, or a build succeeds or fails. It does not assert that a particular function was called, that an ORM method ran, or that a component rendered a specific class. Tests that would break under a refactor with identical behaviour are wrong.

**One new seam — the HTTP boundary of the Contact endpoint.** Tests construct a `Request` and assert the status code, the response body shape, and whether a Contact Message exists in a fake store. The database port and the mail port are injected fakes, so no test opens a network connection or a real database. This single seam covers validation, honeypot behaviour, rate limiting, persistence, mail degradation, and error responses.

**One inherited seam — the content-collection schema.** Frontmatter is validated by the schema at build time, so content correctness is tested by the build. No additional assertion layer is written over the schema's own validation.

**One end-to-end smoke.** Playwright fills and submits the Contact form against a built preview and asserts the success message. This is the only place the form's markup, the client fetch, and the route are exercised together, and it is the only flow that crosses the seam the unit tests cannot see.

**Not tested.** Page layouts, presentational components, and styling. Testing them would restate the implementation and would need updating on every design change.

**Prior art.** None — this is a greenfield repository and the predecessor `astro-sphere` fork shipped no tests at all. There is no existing pattern to follow, so the Contact endpoint's test file becomes the pattern.

`astro check` and the production build run in CI on every push, because a type error or a bad content file must fail before deploy rather than in production.

## Out of Scope

- The admin list view for Contact Messages (v1.1), including its login screen.
- Site search. The theme's client-side search is not ported.
- Tag index pages. Tags are displayed but not browsable by tag in v1.
- MDX and embedded components in Posts.
- Reading time, view counts, comments, guestbook, or any second runtime surface.
- Testimonials and social proof sections.
- Generated Open Graph images per Post; one default image only.
- Internationalisation. English only.
- A generated Resume page. The Resume remains a PDF.
- A newsletter, a CMS, or database-driven content.
- Any migration of readers or SEO authority beyond serving the same routes at the same domain.

## Further Notes

- **Facts about the current production state**, verified rather than assumed: `www.budigunawan.com` resolves to Vercel via a Cloudflare-managed CNAME; production robots and sitemap both point at `astro-sphere-demo.vercel.app`; `/work`, `/projects`, `/projects/janjiraga`, `/projects/bambino` and `/blog` return 200; `/contact` returns 404; the serving build is the `budiigunawan-astro` fork, not the older static HTML repository.
- **Consequence for migration:** because the live routes already match the new routes, no redirect table is required except that `/contact` starts working. The old project moves to a subdomain rather than being deleted.
- **Open input, not a blocker:** the topic of the first Post is Budi's to choose. Launch does not require more than one.
- **Human prerequisites before launch:** create the Neon project, verify `budigunawan.com` with the mail provider (a DNS record at Cloudflare), create the new Vercel project and move the domain, and set the environment secrets.
- **Acceptance:** v1 is done when `budigunawan.com` serves the rebuilt site over HTTPS with the old project available at its subdomain, every listed route returns 200, a submitted Contact Message arrives by email and is retrievable from the database, invalid and bot submissions are rejected without an email, the sitemap names the real domain, the RSS feed validates, and `astro check`, the build, and the Contact endpoint and smoke tests all pass in CI.
- **Deferred decisions** that will need their own tickets later: the exact accent colour and type pairing, and the admin view's session lifetime.
