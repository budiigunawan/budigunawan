# Astro 5 in a new repository, with hand-written components

The site is content-first — work, projects, writing — with exactly one form endpoint. Astro prerenders it to near-zero JS and its content collections already model the three content types, so the existing `budiigunawan-astro` content ports over as files.

Rejected Next.js despite it being the stack Budi writes daily: RSC and server components buy nothing for a site with one `POST` handler, and they cost bundle size and conceptual surface. Rejected continuing in `budiigunawan-astro` in place: it is a fork of the astro-sphere theme, so its design is the theme's rather than Budi's, and it ships the theme's bugs — production's sitemap still points at `astro-sphere-demo.vercel.app`.

Consequence: React experience transfers only through islands, and any future feature that wants RSC or edge middleware reopens this decision.
