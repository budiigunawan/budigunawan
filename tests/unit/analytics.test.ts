import { describe, expect, it } from 'vitest';
import { shouldLoadAnalytics } from '../../src/lib/analytics';

const productionHostname = 'budigunawan.com';
const token = 'a-cloudflare-web-analytics-token';

describe('shouldLoadAnalytics', () => {
  it('loads on the production hostname when the build has a token', () => {
    expect(
      shouldLoadAnalytics({ token, hostname: productionHostname, productionHostname }),
    ).toBe(true);
  });

  it('stays off when the build has no token', () => {
    expect(shouldLoadAnalytics({ token: '', hostname: productionHostname, productionHostname })).toBe(
      false,
    );
  });

  it('stays off on a Preview hostname', () => {
    expect(
      shouldLoadAnalytics({
        token,
        hostname: 'my-branch-budigunawan.budi.workers.dev',
        productionHostname,
      }),
    ).toBe(false);
  });

  it('stays off on localhost', () => {
    expect(shouldLoadAnalytics({ token, hostname: 'localhost', productionHostname })).toBe(false);
  });

  it('stays off on www, which redirects to the production hostname', () => {
    expect(shouldLoadAnalytics({ token, hostname: `www.${productionHostname}`, productionHostname })).toBe(
      false,
    );
  });
});
