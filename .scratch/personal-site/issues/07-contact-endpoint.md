# 07: Contact endpoint

**What to build:** The site's only runtime surface. `POST /api/contact` accepts a name, email and message plus a honeypot field, validates them, rejects obvious bots, limits submissions per client, stores a Contact Message in Postgres, and only then sends a notification email. A failed notification never loses the message. The handler reaches storage and mail through two injected ports so it can be tested over HTTP with fakes and no network.

**Blocked by:** 01: Scaffold, shell and CI

**Status:** ready-for-agent

- [x] A valid submission returns a success status, stores exactly one Contact Message, and sends exactly one notification.
- [x] A missing, empty or malformed field returns a client error with a field-level body, and nothing is stored.
- [x] A filled honeypot returns a success response and stores nothing, giving the bot no signal it was caught.
- [x] Exceeding the per-client limit over the rolling window returns a too-many-requests status and stores nothing.
- [x] When the notifier fails, the Contact Message is still stored, the response is still a success, and a log line identifies the stored message without logging its body.
- [x] The client key is a hash, never the raw address, and no request body content is written to logs.
- [x] Submissions from another origin are rejected.
- [x] The handler is tested at the HTTP boundary with fake storage and fake notification; no test opens a database or a network connection.
- [x] The storage migration applies cleanly to an empty database.
- [x] Preview deployments use a database separate from production, so a test submission cannot reach the real inbox.

## Comments

**2026-11-24 — Implemented**

- `src/lib/contact/handler.ts` is the contract and depends only on the two ports in `src/lib/contact/ports.ts`; `src/pages/api/contact.ts` sets `prerender = false` and is the only module that builds the Prisma store and the Resend notifier. `src/lib/contact/config.ts` resolves the environment, `server.ts` memoizes the Prisma client per serverless instance.
- Order is method/origin → content type and parse → honeypot → validation → rolling limit → store → notify. A filled `website` field returns the same `200 {"ok":true}` (or `303 /contact?sent=1`) as a real success and writes nothing. Name is 1–100 after trimming, email is required and syntactically valid up to 254, message is 10–5,000.
- The client key is `HMAC-SHA256(address, CONTACT_CLIENT_KEY_SECRET)` stored as 64 hex characters; the raw `x-forwarded-for`/`x-real-ip` value is never stored. The limit defaults to 5 per rolling 60 minutes and is counted from stored messages, so preview and production limits do not share a table.
- A notifier failure logs `[contact] notification failed for <id>: <error name>` after the save and still answers success; storage failure logs only the error name and answers a generic 500. Node logs nothing else, so no name, email or body appears in any log line.
- Origin allowlisting covers `site.url`, Vercel's deployment, branch and production hostnames, local dev origins outside production, and `CONTACT_ALLOWED_ORIGINS`; a mismatch is refused before the body is read. Requests with neither `Origin` nor `Referer` are allowed for tooling.
- One contract, two transports: JSON bodies for JSON callers; `303` back to `/contact` for urlencoded and multipart form callers, with `sent=1` or `error=validation|rate|rejected|invalid|unavailable`.
- `prisma/schema.prisma` defines `contact_messages` with a `(client_key, created_at)` index; `prisma/migrations/20261124030000_contact_message/migration.sql` is generated from that schema. `databaseUrlFromEnv` reads `PREVIEW_DATABASE_URL` only when `VERCEL_ENV=preview`, with no fallback to `DATABASE_URL`, and preview deployments replace the notifier with a log-only one, so a test submission cannot reach the production table or the real inbox.
- The endpoint contract and every environment variable are written down in `docs/contact-endpoint.md`; `.env.example` lists the variables. README covers the commands, the module map, the install/generate split and the CI steps.
- pnpm blocks dependency lifecycle scripts, so CI and Vercel install with `--ignore-scripts` and generate the Prisma client explicitly: `.github/workflows/ci.yml` gains generation and test steps, and `vercel.json` sets the matching install and build commands. `prisma generate` needs no database.

Verification: `pnpm exec vitest run` passes 28 tests at the HTTP boundary with fakes (valid, validation bounds, honeypot, rolling limit and window expiry, per-client isolation, notifier failure, log privacy, origin/referer rejection, both transports, store failure, method and format rejection, preview database selection). `pnpm check` reports 0 errors, 0 warnings and 0 hints, and `pnpm build` emits a `_render` function with `/api/contact` routed to it and the Prisma engine traced. Against a temporary empty Postgres 17 cluster, `prisma migrate deploy` and a raw `psql -f` of the migration both applied cleanly, and a temporary integration run stored and counted rows through `createPrismaContactStore`. Over HTTP against `astro dev` with the real store: valid JSON `200`, invalid fields `400`, honeypot `200` with no row, cross-origin `403`, form post `303 /contact?sent=1`; five submissions from one address stored five rows and the next answered `429`; the table held only the valid messages, each with a 64-character key. A clean-tree CI simulation (`pnpm install --frozen-lockfile --ignore-scripts`, generate, tests, check, build) all exited 0.
