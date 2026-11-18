# 02: Deploy to Cloudflare

**What to build:** The skeleton is live at https://budigunawan.com. Every push to `main` deploys to production automatically and every other branch gets a preview URL. Merging to `main` requires CI to pass. Production reports privacy-friendly analytics without a cookie banner. This needs Budi's GitHub and Cloudflare accounts, so a human drives it (an agent can assist with config and commands).

Spec: `.scratch/personal-site-v1/spec.md`

**Blocked by:** 01 (Walking skeleton)

**Status:** ready-for-human

- [ ] Code pushed to a public GitHub repository
- [ ] Cloudflare Workers with static assets serves the built site, connected via Workers Builds to the GitHub repo
- [ ] Pushes to `main` deploy to production; other branches produce preview URLs
- [ ] budigunawan.com (DNS already on Cloudflare) is attached as the custom domain over HTTPS
- [ ] `www.budigunawan.com` redirects permanently to `https://budigunawan.com`
- [ ] Cloudflare Web Analytics is enabled and its beacon loads on production only (not on previews or local)
- [ ] Branch protection on `main` requires the CI checks from ticket 01 to pass before merge
- [ ] A short note in the README describes how deploys and previews work
