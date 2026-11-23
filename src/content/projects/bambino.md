---
title: Bambino
summary: A simple, user-friendly e-commerce platform for baby clothes, with a storefront, cart, checkout and user accounts.
kind: personal
date: '2024-07-14'
stack:
  - TypeScript
  - React
  - Vite
  - Tailwind CSS
  - shadcn/ui
  - Hono
  - Prisma
  - PostgreSQL
  - Oslo
tags:
  - e-commerce
  - retail
  - authentication
demoUrl: https://bambino.budigunawan.com
repoUrl: https://github.com/budiigunawan/bambino
cover:
  src: /images/projects/bambino-hero.jpeg
  alt: Four children running across a playground, with the Bambino wordmark and the tagline "Comfort for your little one's journey."
  width: 1155
  height: 578
featured: true
built:
  - A storefront for discovering products and reading product details.
  - A shopping cart and a checkout flow.
  - User authentication with Oslo, covering password hashing and sessions.
impact:
  - Runs as a working storefront at bambino.budigunawan.com.
  - A solo, end-to-end build spanning the React frontend, the Hono API, Prisma and PostgreSQL.
---

## The goal

Bambino is a storefront for baby clothes, built to work well on every screen and to make navigation obvious. It was also a deliberate exercise in full-stack work: pairing the frontend with an API of my own, rather than stopping at the browser.

## Lessons learned

### Authentication with Oslo

Bambino was my first project using Oslo for authentication. It offers a set of small tools rather than a framework: APIs for creating JWTs, managing OAuth 2.0 clients, hashing passwords and verifying WebAuthn responses. Its lightweight design and minimal dependencies made it a flexible base for the account flows.

The takeaway was that authentication is mostly a set of decisions about sessions, storage and expiry, and a small library forces you to make them explicitly instead of inheriting them.
