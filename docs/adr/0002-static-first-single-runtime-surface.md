# Static-first with exactly one runtime surface

Every page is prerendered. The only code that runs per-request is `POST /api/contact`, which validates input, inserts a Contact Message into Neon Postgres via Prisma, and sends a Resend notification. `/admin` (v1.1) is the second and last exception. The Vercel adapter is configured, but only those routes opt out of prerendering.

Rejected SSR everywhere: slower, more surface to secure, no benefit for content that changes when Budi commits. Rejected a managed form service: no practice, and visitor data leaves to a third party for no gain. Rejected a database-driven content model with an admin CMS: far heavier than the content needs, and markdown in git is already the source of truth.

Consequences: adding a second dynamic surface is an explicit decision, not a default. Contact Messages are the only personal data the site stores, which is why `/privacy` exists.
