---
title: Janjiraga
summary: A social platform that brings sports enthusiasts together to find, create and join events in their area.
kind: personal
date: '2024-08-08'
stack:
  - TypeScript
  - React
  - Vite
  - Tailwind CSS
  - shadcn/ui
  - Hono
  - Prisma
  - PostgreSQL
  - Mapbox
tags:
  - social platform
  - sports
  - events
  - community
repoUrl: https://github.com/janjiraga/janjiraga
cover:
  src: /images/projects/janjiraga-hero.png
  alt: The Janjiraga landing page, headed "Get healthy, play together", above tiles for badminton, football, volleyball, basketball, futsal, running, gym and tennis.
  width: 767
  height: 556
featured: true
built:
  - A social platform where members discover events, create their own and join others nearby.
  - Authentication and membership flows on a Hono API with Prisma and PostgreSQL.
  - Venue maps on every event, built with Mapbox.
impact:
  - Delivered as a working product with a team of three, from design through release.
  - Led the build as team lead, mentoring two developers who were new to the stack.
---

## The problem

Finding people to play a sport with is mostly a coordination problem. Janjiraga helps you find and connect with like-minded people in your area to play together, train and stay active, whatever your skill level. You can discover events, create your own and join the ones that already exist.

## Leading a team of first-time contributors

Leading a team of beginner developers was the most demanding part of the project, and the most useful.

- **Guidance and support.** Helping teammates through tricky tasks and giving positive feedback improved their skills and built their confidence.
- **Managing time.** Balancing deadlines against the pace at which people were learning meant prioritising tasks and setting achievable goals.
- **Reviewing in the open.** A shared codebase gave everyone a place to practise review and design handoff, not just their own slice of the work.

## Mapping venues with Mapbox

<img src="/images/projects/janjiraga-map.png" alt="A map of a venue, with a marker over the location" width="609" height="628" loading="lazy" decoding="async" />

We added a map to every event so members could see where to meet. It was my first time using Mapbox, and it proved easier to work with than the Google Maps API: the documentation was thorough and the integration took far less work than I expected.

## Credits

- **Budi Indra Gunawan** — team lead, design, fullstack
- **Henhen Imam Muldani** — backend
- **Maruf Hasan** — frontend
