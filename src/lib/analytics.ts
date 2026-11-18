/** Cloudflare Web Analytics beacon script. */
export const CLOUDFLARE_BEACON_URL = 'https://static.cloudflareinsights.com/beacon.min.js';

export interface AnalyticsGate {
  /** Web Analytics site token, or an empty string when the build has none. */
  token: string;
  /** Hostname the page is being served from. */
  hostname: string;
  /** Hostname the production site is served from. */
  productionHostname: string;
}

/**
 * Previews and local builds ship the same HTML as production, so the hostname
 * the page is served from decides whether analytics run.
 */
export function shouldLoadAnalytics({
  token,
  hostname,
  productionHostname,
}: AnalyticsGate): boolean {
  return token.length > 0 && hostname === productionHostname;
}
