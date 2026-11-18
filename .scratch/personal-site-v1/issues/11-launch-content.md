# 11: Launch content

**What to build:** The live site at budigunawan.com shows Budi's real content instead of placeholders and passes the quality bar in production. Budi supplies the content; an agent can help format it into the content collections.

Spec: `.scratch/personal-site-v1/spec.md`

**Blocked by:** 02 (Deploy to Cloudflare), 04 (About, Experience and CV), 06 (Case Studies and Featured Projects), 09 (Post reading experience), 10 (SEO, social metadata and OG images)

**Status:** ready-for-human

- [ ] Site profile filled with real name, role, pitch, bio, public email, GitHub URL and LinkedIn URL
- [ ] Real CV PDF in place and served at `/cv`
- [ ] Real Experience entries
- [ ] 2–3 flagship Projects with Case Studies marked featured, plus other real Projects
- [ ] Placeholder Posts removed (or turned into Drafts); any real Posts published. Launching with zero Posts is fine: the Blog stays hidden
- [ ] Placeholder demo content removed from production output
- [ ] Lighthouse ≥ 95 in every category on mobile and CLS = 0 against production for the key routes
- [ ] axe reports zero violations against production in both themes
- [ ] Shared links to Home, a Case Study and a Post preview correctly on LinkedIn and X
