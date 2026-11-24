import { createHmac } from 'node:crypto';

/** Vercel sets `x-forwarded-for`; the left-most entry is the client. */
export function clientAddress(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/**
 * The store only ever sees this key: an HMAC of the address, so past
 * submissions can be counted without keeping the address itself. The secret
 * also stops a leaked database from being matched against a list of addresses.
 */
export function deriveClientKey(address: string, secret: string): string {
  return createHmac('sha256', secret).update(address).digest('hex');
}
