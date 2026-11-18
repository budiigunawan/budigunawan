import { CLOUDFLARE_BEACON_URL, shouldLoadAnalytics } from '../lib/analytics';

const token = document.body.dataset.analyticsToken ?? '';
const productionHostname = document.body.dataset.analyticsHost ?? '';

if (shouldLoadAnalytics({ token, hostname: window.location.hostname, productionHostname })) {
  const beacon = document.createElement('script');
  beacon.src = CLOUDFLARE_BEACON_URL;
  beacon.defer = true;
  beacon.dataset.cfBeacon = JSON.stringify({ token });
  document.head.append(beacon);
}
