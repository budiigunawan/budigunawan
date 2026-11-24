# 06: Resume and privacy

**What to build:** The Resume served from Budi's own domain as a PDF, linked from the navigation, with no intervening sign-in or third-party viewer. Alongside it, a privacy page that states what the Contact form stores, why, and who can read it, authored as content so it can be edited without a code change.

**Blocked by:** 01: Scaffold, shell and CI

**Status:** ready-for-agent

- [x] The Resume is served as a PDF from the site's own domain, and opening the navigation link downloads or displays it without a login.
- [x] The navigation link is the only Resume surface; there is no resume page route.
- [x] The privacy page states which data a Contact Message contains, why it is stored, and who can read it.
- [x] Privacy content is authored as a Legal entry, so text changes need no code change.
- [x] Both the Resume link and the privacy page are reachable from the footer.
- [x] The privacy page has a single h1 and is readable at 320px.

## Comments

**2026-11-24 — Implemented**

- `public/resume.pdf` is the canonical Resume, copied byte-for-byte from the copy already published from Google Drive (PDF 1.4, one page, SHA-256 `125d515c…d43f7b`). It is served from the site's own origin at `/resume.pdf`; there is no HTML route and no third-party viewer. The navigation link opens it in a new tab with `rel="noopener"` and a screen-reader note, and adds no `aria-current` because it is never the current page.
- `src/content.config.ts` declares the fourth collection, `legal`, with `title` and `date` as `YYYY-MM-DD` and unknown keys rejected. `src/content/legal/privacy.md` holds the wording; `getLegalEntry('privacy')` in `src/lib/content.ts` throws when the entry is absent rather than rendering an empty policy page. `/privacy` renders that entry in a single `h1` with the date, and the body is plain markdown, so a text change needs no code change.
- The Privacy copy names the three fields a Contact Message contains, why it is stored (reply, survive a failed notification, rate limit repeated submissions using a hashed IP and never the raw address), and who reads it (only Budi, through a private hosted database and the notification email; those processors act on his behalf). `/contact` is not linked yet because that route arrives in ticket 08.
- `site.nav` gains Resume; `site.footerNav` repeats Resume and links Privacy, rendered as a labelled `Site` nav beside the existing `Elsewhere` socials. `NavItem` gains an optional `newTab`, used by both the header and the footer so file links behave the same in both places.
- Adding a fifth navigation item exposed horizontal overflow at 320px in the shell. The header now puts the wordmark and theme toggle on the first row and gives the primary nav the full width below it at phone sizes, tightening its item padding and gap below `sm`; at `sm` and up the nav returns to the right of the wordmark beside the toggle. All routes now fit 320px without sideways scrolling.
- README documents the `legal` collection, `public/resume.pdf`, `/privacy`, and the Resume exception to the navigation rule; `GLOSSARY.md` defines the Legal entry.

Verification: `pnpm check` reports 0 errors, 0 warnings and 0 hints. `pnpm build` succeeds with 11 pages; `dist/resume.pdf` is byte-identical to the source and `pnpm preview` answers `/resume.pdf` with 200 `application/pdf` (59,679 bytes) and `/privacy/` with 200 HTML. The built privacy page has exactly one `h1`, three `h2` sections, and the updated date as a `<time>`. A temporary sentence added to `privacy.md` appeared in the built page with no code change, then the file was restored byte-for-byte; with the content cache cleared and the entry removed, the build fails naming the missing `privacy` entry. At 320px every route (`/`, `/work`, `/projects`, each Project detail, `/blog`, the Post, `/retro`, `/privacy`, `/404.html`) reports `scrollWidth === clientWidth === 320`, exactly one `h1`, and both footer links; the same holds at 390px and 1440px.

