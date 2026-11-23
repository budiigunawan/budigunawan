# 08: Contact form, with and without JavaScript

**What to build:** The contact page and its form. With JavaScript it submits in place and shows a per-field error or a confirmation; without JavaScript the same form posts normally and returns to the page in a confirmation state. The honeypot is present but unreachable by keyboard and assistive technology. One endpoint, two transports.

**Blocked by:** 07: Contact endpoint

**Status:** ready-for-agent

- [ ] The contact page presents name, an email field, a message field and a honeypot field.
- [ ] The honeypot is not reachable by keyboard, not exposed to assistive technology, and not visible to sighted users.
- [ ] With JavaScript, a valid submission shows an in-place confirmation without a page reload, and an invalid one shows an inline error per offending field.
- [ ] Without JavaScript, a valid submission performs an ordinary form post and lands back on the contact page in a confirmation state.
- [ ] The confirmation states only that the message was received, never that it was read or delivered to an inbox.
- [ ] A Playwright test fills and submits the form against a built preview and asserts the confirmation.
- [ ] The form is fully operable by keyboard, every control has a label, and the page is usable at 320px.
