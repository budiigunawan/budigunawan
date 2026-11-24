---
title: 'Rebuilding this site from scratch'
summary: 'The last version was a theme with my content dropped into it. This one is mine: Astro, markdown in git, and one ticket at a time.'
date: '2026-11-23'
tags:
  - meta
  - astro
  - web
featured: true
---

The site you are reading is new. The previous version was a fork of an Astro theme with my content dropped into it. The design was someone else's, and so were the bugs: its production sitemap still pointed at the theme author's demo domain, the Blog link in its navigation was commented out, and the Contact page it advertised returned a 404. A site that asks people to get in touch and then drops them on an error page is worse than a site with no call to action.

So I started again, in a new repository, and wrote down the decisions before writing the code. A few of them shaped everything else.

## Astro, because the site is content

The site publishes three kinds of thing: where I have worked, what I have built, and what I have written. All three are markdown files in git. All three change when I commit, not when someone submits a form.

I write React and Next.js every day, so Next.js was the obvious choice. It was also the wrong one. Server components and edge rendering buy nothing for a site whose only dynamic surface is a contact form, and they cost bundle size and a second mental model of where code runs. Astro prerenders the whole thing, ships no client framework, and lets a content collection own the shape of an entry.

## Static first, one runtime surface

Every page is generated at build time. Exactly one thing is allowed to run per request: `POST /api/contact`. Making that an explicit rule means a second dynamic route is a decision I have to argue for, not something that creeps in.

It also means the content layer can be strict. The schema is the single authority on what a Post, Project, or Work Entry is, and a missing or malformed field fails the build instead of rendering `undefined` into a paragraph. Drafts go one step further and are filtered out of production entirely:

```ts
const posts = await getCollection('posts');
const published = posts.filter((post) => !import.meta.env.PROD || !post.data.draft);
```

In development that line does nothing, so I can read a draft at its real URL. In a production build the draft has no index entry and no route at all. It cannot be published by accident.

## Built in the open, one ticket at a time

The rebuild is split into small tickets: the shell and CI, the work timeline, Projects as the unit of evidence, and now this writing surface. Each one has acceptance criteria I can check, and each one lands as its own change. The tickets live in the repository next to the code they describe, which makes the order of the work visible to anyone who looks.

That is slower than opening a page builder and typing. It also means the site is evidence of the thing it claims: a frontend engineer who can take a blank repository and ship a working, accessible, fast site end to end.

Still to come: the Contact form and the endpoint behind it, the Resume as a real file rather than a route, an RSS feed, and the copy that turns this from a working site into a place someone wants to stay.
