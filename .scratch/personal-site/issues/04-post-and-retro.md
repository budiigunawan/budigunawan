# 04: Post and Retro

**What to build:** The writing surface. A Post is markdown with a title, summary, date and topic tags; `/blog` lists published Posts newest first, `/blog/:slug` renders one with a comfortable reading measure and highlighted, copyable code, and `/retro` lists the Posts tagged retro. Drafts stay out of production. The two theme demo posts are deleted and the first real Post is published.

**Blocked by:** 01: Scaffold, shell and CI

**Status:** ready-for-agent

- [x] A Post is authored as markdown declaring title, summary, date and topic tags, with optional cover image and alt text, featured flag and draft flag.
- [x] A missing or malformed required field fails the build naming that field.
- [x] `/blog` lists published Posts newest first with date, summary and tags.
- [x] `/blog/:slug` renders a Post at a comfortable reading measure, with syntax highlighting and a copy control on every code block.
- [x] `/retro` lists the Posts tagged retro, newest first, and a Retro is written exactly like any other Post.
- [x] A draft Post appears in no index and no route in a production build, while remaining visible in local development.
- [x] Printing a Post omits navigation, the theme toggle and the footer.
- [x] The two theme demo posts are deleted, and at least one real Post is published.
- [x] Tags are displayed but not browsable; no tag route exists.
- [x] Posts are readable at 320px, and code blocks scroll within their own container rather than the page.

## Comments

**2026-11-23 — Implemented**

- `src/content.config.ts` declares the `posts` collection. Frontmatter requires `title`, `summary`, `date` (`YYYY-MM-DD`) and at least one topic `tag`, with `cover` (`src` under `public/images/posts/`, `alt`, `width`, `height`), `featured` and `draft` optional. Unknown keys are rejected. The schema is the single authority, so a missing or malformed field fails the build naming that field.
- `src/lib/content.ts` exposes `getPosts()` (published, newest first, title breaking date ties) and `getPostsByTag()` (case-insensitive tag match). Drafts are filtered when `import.meta.env.PROD` is set, so they render in development but appear in neither a production index nor a production route.
- `/blog` lists published Posts newest first with date, summary and tags; `/blog/[slug]` renders one with the date and tags, the summary, an optional cover, and the body. Tags render as plain text, never as links, and no tag route exists. `/retro` reads the Posts tagged `retro` through the same query, so a Retro is written exactly like any other Post; it carries an empty state until the first one exists.
- The Post body uses a looser rhythm and a `68ch` measure. Markdown fences are highlighted by Shiki with a light and a dark palette, selected by the same system-preference-plus-override signals as the colour tokens, and every block sits in a container whose top strip holds a copy control. The control's markup comes from a rehype plugin and its behaviour from a page script, so without JavaScript the button stays hidden rather than dead. The `<pre>` is focusable and scrolls horizontally inside its own border.
- Printing a Post drops the header, the footer, the theme toggle, the copy controls and the back links; the body prints at full width and code blocks avoid breaking across pages.
- `Blog` joins the navigation now that the route exists, and its nav item stays current on Post pages. The two theme demo posts never entered this repository, which was scaffolded fresh in 01, so there was nothing to delete; the first real Post, "Rebuilding this site from scratch", is published from the site's own decisions.

Verification: `pnpm check` reports 0 errors, 0 warnings and 0 hints, and `pnpm build` succeeds with `/blog`, `/blog/rebuilding-this-site` and `/retro`. Malformed content failed the build naming the field: a missing `title`, `2024-02-31` for `date`, a `cover` without `alt`, and empty `tags`. A temporary `draft: true` Post appeared on `/blog` and at its own URL under `pnpm dev`, and was absent from the production build's index and routes; the probe was removed. Two temporary Posts tagged `Retro` and `retro` appeared on `/retro` newest first while an untagged Post did not, then were removed. In the built site an unknown Post slug returns the styled 404. At 320, 768 and 1280px `/blog`, `/retro` and the Post render one `h1`, no tag links, and `scrollWidth === clientWidth`; at 320px the code block's own scroll width exceeds its width while the page does not overflow. With print media emulated in both a light and a dark OS preference, and with `data-theme="dark"` pinned, the header, footer, theme toggle, back links and copy control compute to `display: none`, the page resolves to the light palette, the code block wraps its long line instead of clipping it, and the strip reserved for the copy button collapses. Clicking the copy control on the Post passes the exact code text to the clipboard, shows "Copied", and resets to "Copy" after two seconds; the block's token colours change between the light and dark palettes.
