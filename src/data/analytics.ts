/**
 * Cloudflare Web Analytics token, inlined at build time from the
 * `PUBLIC_CF_ANALYTICS_TOKEN` build variable. It is empty when the variable is
 * unset, which keeps local builds from reporting anything.
 */
export const analyticsToken: string = import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN ?? '';
