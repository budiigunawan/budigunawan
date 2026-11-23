# 11: Cutover

**What to build:** Moving the domain. The previous site is preserved under its own subdomain, the rebuilt site claims the apex and `www` over HTTPS with no redirect chain, secrets live only in environment configuration, the mail provider's domain verification is in place, and production is verified end to end with a real Contact Message.

**Blocked by:** 09: Discovery and SEO, 10: Quality gate

**Status:** ready-for-agent

- [ ] `budigunawan.com` and `www` serve the rebuilt site over HTTPS with no redirect chain.
- [ ] The previous site remains reachable at its own subdomain.
- [ ] Every secret — database URL, mail key, admin password hash, session secret — exists only in environment configuration and none is committed.
- [ ] The mail provider's domain verification record is in place, and a real submission arrives in Budi's inbox.
- [ ] Every route named in the spec returns a success status on production, and the contact page no longer returns not-found.
- [ ] The live sitemap and robots directives name the production domain.
- [ ] A production Contact Message is retrievable from the database and its notification arrived.
- [ ] Analytics records a real visit to production.
