# 07: Contact endpoint

**What to build:** The site's only runtime surface. `POST /api/contact` accepts a name, email and message plus a honeypot field, validates them, rejects obvious bots, limits submissions per client, stores a Contact Message in Postgres, and only then sends a notification email. A failed notification never loses the message. The handler reaches storage and mail through two injected ports so it can be tested over HTTP with fakes and no network.

**Blocked by:** 01: Scaffold, shell and CI

**Status:** ready-for-agent

- [ ] A valid submission returns a success status, stores exactly one Contact Message, and sends exactly one notification.
- [ ] A missing, empty or malformed field returns a client error with a field-level body, and nothing is stored.
- [ ] A filled honeypot returns a success response and stores nothing, giving the bot no signal it was caught.
- [ ] Exceeding the per-client limit over the rolling window returns a too-many-requests status and stores nothing.
- [ ] When the notifier fails, the Contact Message is still stored, the response is still a success, and a log line identifies the stored message without logging its body.
- [ ] The client key is a hash, never the raw address, and no request body content is written to logs.
- [ ] Submissions from another origin are rejected.
- [ ] The handler is tested at the HTTP boundary with fake storage and fake notification; no test opens a database or a network connection.
- [ ] The storage migration applies cleanly to an empty database.
- [ ] Preview deployments use a database separate from production, so a test submission cannot reach the real inbox.
