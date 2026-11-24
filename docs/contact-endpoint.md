# Contact endpoint contract

`POST /api/contact` is the only route in the site that runs per request. It
validates a Contact Message, rejects obvious bots and repeated submissions,
stores the message in Postgres, and only then sends a notification email.

The handler lives in `src/lib/contact/handler.ts` and depends on two injected
ports — `ContactStore` and `ContactNotifier` (`src/lib/contact/ports.ts`). The
route at `src/pages/api/contact.ts` is the only place that builds the Prisma
and Resend implementations. Tests construct a `Request` and substitute fakes,
so the suite opens no database and no network connection.

## Request

Accepted content types:

- `application/json`
- `application/x-www-form-urlencoded`
- `multipart/form-data`

Fields, in all transports:

| Field     | Required | Rules                                                                 |
| --------- | -------- | --------------------------------------------------------------------- |
| `name`    | yes      | Non-empty after trimming, at most 100 characters.                     |
| `email`   | yes      | Non-empty after trimming, at most 254 characters, syntactically valid. |
| `message` | yes      | Non-empty after trimming, between 10 and 5,000 characters.            |
| `website` | no       | The honeypot. Must be empty; a person never sees or focuses it.       |

A browser must send an `Origin` (or, failing that, a `Referer`) whose origin is
the site, its preview URL, or an origin listed in `CONTACT_ALLOWED_ORIGINS`.
Requests with neither header are allowed so command-line tools can exercise the
contract. A mismatched origin is rejected before the body is read.

## Responses

JSON callers get JSON with one stable shape:

```json
{ "ok": true }
```

```json
{ "ok": false, "errors": { "email": "That email address does not look right." } }
```

`errors` always has at least one key. Validation failures use `name`, `email`
or `message`; failures that are not about one field use `form`.

| Status | When                                                                 |
| ------ | -------------------------------------------------------------------- |
| `200`  | Stored and notified, or the honeypot was filled (indistinguishable).  |
| `400`  | A field is missing, blank, malformed, or outside its length bounds.   |
| `403`  | The request came from another origin.                                |
| `405`  | The method is not `POST`. `Allow: POST` is set.                       |
| `415`  | The content type is not one of the three above.                       |
| `429`  | The client exceeded the rolling submission limit.                     |
| `500`  | Storage failed, or configuration is missing. No detail is returned.   |

Form callers never receive JSON. Every outcome is a `303 See Other` back to the
Contact page, which makes the no-JavaScript path a real navigation:

| Outcome       | `Location`                    |
| ------------- | ----------------------------- |
| stored        | `/contact?sent=1`             |
| honeypot      | `/contact?sent=1`             |
| validation    | `/contact?error=validation`   |
| rate limit    | `/contact?error=rate`         |
| other origin  | `/contact?error=rejected`     |
| bad transport | `/contact?error=invalid`      |
| storage error | `/contact?error=unavailable`  |

Every response carries `cache-control: no-store`.

## Order of checks

1. Method and origin.
2. Content type and body parse.
3. Honeypot: a filled field returns the success answer and writes nothing.
4. Validation.
5. Rolling rate limit for this client key.
6. Store the message.
7. Notify. A notification failure is logged and does not fail the request.

Storage always precedes notification, so a mail provider having a bad minute
cannot lose a message.

## Rate limiting

The limit is per client over a rolling window, counted in the database from
stored messages. The default is 5 messages per 60 minutes, configurable with
`CONTACT_RATE_LIMIT_MAX` and `CONTACT_RATE_LIMIT_WINDOW_MINUTES`. The count and
the insert are separate statements, so deliberately concurrent requests can
exceed the limit by the number of requests in flight; that is acceptable for a
personal inbox and keeps the endpoint free of a second lock.

The client key is `HMAC-SHA256(address, CONTACT_CLIENT_KEY_SECRET)`, stored as
hex. The raw address is never written to the database or a log, and the secret
stops a leaked table from being matched against a list of addresses. The address
comes from the first entry of `x-forwarded-for`, then `x-real-ip`.

## Logging

- Notification failure: `[contact] notification failed for <stored message id>: <error name>`.
  The stored id is enough to find and recover the message; the body and the
  sender are never logged.
- Storage failure: `[contact] storing failed: <error name>`.
- Mail not configured: `[contact] mail is not configured; <id> was not notified`.
- Preview deployment: `[contact] preview stored <id>; notification skipped`.

Nothing from the request body is written to any log.

## Configuration

| Variable                              | Environment         | Purpose                                                                 |
| ------------------------------------- | ------------------- | ----------------------------------------------------------------------- |
| `DATABASE_URL`                        | Production, local   | Postgres connection string. Prisma also reads it for migrations.        |
| `PREVIEW_DATABASE_URL`                | Preview only        | A database that is not production.                                      |
| `CONTACT_CLIENT_KEY_SECRET`           | All                 | Long random string used to hash client addresses. Required.             |
| `CONTACT_ALLOWED_ORIGINS`             | Optional            | Comma-separated extra origins, such as a custom preview domain.         |
| `CONTACT_RATE_LIMIT_MAX`              | Optional            | Messages per client per window. Default `5`.                            |
| `CONTACT_RATE_LIMIT_WINDOW_MINUTES`   | Optional            | Rolling window length. Default `60`.                                    |
| `RESEND_API_KEY`                      | Production          | Resend API key. Without it, messages are stored and the gap is logged.  |
| `CONTACT_EMAIL_FROM`                  | Production          | Verified Resend sender, for example `Contact <contact@budigunawan.com>`. |
| `CONTACT_EMAIL_TO`                    | Optional            | Notification recipient. Defaults to the address in `src/config/site.ts`. |

### Preview deployments

`databaseUrlFromEnv` reads `PREVIEW_DATABASE_URL` when `VERCEL_ENV` is
`preview` and `DATABASE_URL` otherwise. It never falls back from one to the
other, and Vercel scopes each variable to its own environment. A preview
deployment also skips notification entirely, so a test submission cannot reach
the real inbox even if mail credentials leak into the preview environment.

### Deployment

`vercel.json` sets the build command to `pnpm exec prisma generate && pnpm build`,
because Prisma's client is generated code and is not committed. For the same
reason, run `pnpm exec prisma generate` after a fresh install before `astro
check` or the tests.

Apply the migration with:

```sh
DATABASE_URL="$DATABASE_URL" pnpm exec prisma migrate deploy
```

For the preview database, run the same command with
`DATABASE_URL="$PREVIEW_DATABASE_URL"`.
