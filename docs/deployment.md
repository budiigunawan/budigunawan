# Deploying the site

Everything in the repository is ready for Cloudflare Workers with static
assets. This page covers the one-time account setup, which needs Budi's GitHub
and Cloudflare accounts.

[`wrangler.jsonc`](../wrangler.jsonc) is the source of truth for the Worker:

| Setting              | Value                  |
| -------------------- | ---------------------- |
| Worker name          | `budigunawan`          |
| Assets directory     | `./dist`               |
| Custom domain        | `budigunawan.com`      |
| Missing paths        | `404.html` with status 404 |

The Worker name in the dashboard has to match `name` in `wrangler.jsonc`, or
Workers Builds fails the deploy before it starts.

## 1. Public GitHub repository

Push `main` to a public repository, for example `github.com/budigunawan/budigunawan.com`.
`.scratch/` stays out of the repository — it is gitignored on purpose.

## 2. Connect the repository to a Worker

1. Open **Workers & Pages** in the Cloudflare dashboard and select **Create
   application** > **GitHub**.
2. Pick the repository and use these build settings:

   | Setting           | Value                     |
   | ----------------- | ------------------------- |
   | Production branch | `main`                    |
   | Build command     | `npm run build`           |
   | Deploy command    | `npx wrangler deploy`     |
   | Preview command   | `npx wrangler preview`    |
   | Root directory    | `/`                       |

   Workers Builds installs dependencies with `npm ci` before the build command
   runs, so the build command only builds.

3. Name the Worker `budigunawan` and select **Save and Deploy**.

Workers Builds runs the Wrangler version from `devDependencies`, so the build
and local deploys stay on the same release.

4. Open **Settings** > **Build** > **Branch control** and enable **Preview
   Builds**. Every branch other than `main` then gets a preview URL and a pull
   request comment.

Preview builds run the same `npm run build` as production, so the analytics
hostname check is what keeps hits from previews out of the reports.

## 3. Cloudflare Web Analytics

1. Open **Web Analytics** in the dashboard and add `budigunawan.com`.
2. Choose the **JS snippet** installation method and copy the `token` value out
   of the snippet. Do not use automatic setup: the site adds the beacon itself,
   and both together would count visits twice.
3. In the Worker, open **Settings** > **Build** > **Build Variables and
   Secrets** and add:

   ```text
   PUBLIC_CF_ANALYTICS_TOKEN = <the token from the snippet>
   ```

4. Redeploy `main`.

The token is inlined into the HTML at build time, but the browser only adds the
beacon when the hostname is exactly `budigunawan.com`, so preview URLs and
local builds never report.

## 4. Custom domain

The `routes` entry in `wrangler.jsonc` attaches `budigunawan.com` as a custom
domain on the next deploy, which also provisions the certificate. Requirements:

- The `budigunawan.com` zone lives in the same Cloudflare account as the Worker.
- If an existing proxied DNS record points the apex elsewhere, remove it first;
  a custom domain cannot be attached to a hostname that is already routed.

Check it after the deploy:

```bash
curl -sI https://budigunawan.com | head -1
```

## 5. Redirect www to the apex

Workers static assets cannot express host redirects, so this is a zone-level
redirect rule:

1. In **DNS**, make sure `www` exists and is proxied. A CNAME to
   `budigunawan.com` is enough.
2. Go to **Rules** > **Overview** > **Create rule** > **Redirect Rule**.
3. Rule name: `www to apex`.
4. When incoming requests match: **Custom filter expression**, with

   ```text
   http.host eq "www.budigunawan.com"
   ```

5. Then, **Dynamic redirect**:

   - Expression: `concat("https://budigunawan.com", http.request.uri.path)`
   - Status code: `301`
   - Preserve query string: on

Verify it keeps both the path and the query string:

```bash
curl -sI "https://www.budigunawan.com/about?from=test" | grep -i -E "^HTTP|^location"
# HTTP/2 301
# location: https://budigunawan.com/about?from=test
```

The `www` hostname never reaches the Worker, which is why the analytics beacon
only checks for the apex.

## 6. Branch protection on main

GitHub needs a pull request before anything lands on `main`, and the CI check
from `.github/workflows/ci.yml` must pass. In the repository, open
**Settings** > **Rules** > **Rulesets** > **New branch ruleset**:

- Target `main`.
- Require a pull request before merging.
- Require status checks to pass, and select **Tests and quality gates** (it
  appears in the list after the first pull request has run CI).
- Block force pushes.

Or configure it with the CLI:

```bash
gh api --method PUT repos/budigunawan/budigunawan.com/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Tests and quality gates"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

## 7. Verify

- [ ] `https://budigunawan.com` serves the site over HTTPS.
- [ ] `https://www.budigunawan.com/about` redirects with a 301 to
      `https://budigunawan.com/about`.
- [ ] Merging to `main` deploys; a branch push produces a preview URL.
- [ ] Opening the production site in a browser requests
      `static.cloudflareinsights.com/beacon.min.js`; a preview URL and
      `npm run dev` do not.
- [ ] Opening a pull request shows a pending **Tests and quality gates** check,
      and merging is blocked until it passes.
