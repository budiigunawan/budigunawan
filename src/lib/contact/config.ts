import { site } from '../../config/site';
import type { ContactConfig } from './handler';

const DEFAULT_RATE_LIMIT_MAX = 5;
const DEFAULT_RATE_LIMIT_WINDOW_MINUTES = 60;
const LOCAL_DEV_ORIGINS = ['http://localhost:4321', 'http://127.0.0.1:4321'];

/** The page a form submission navigates back to, whatever the outcome. */
export const CONTACT_PAGE_PATH = '/contact';

export interface ContactEnv {
  readonly NODE_ENV?: string;
  readonly VERCEL_ENV?: string;
  readonly VERCEL_URL?: string;
  readonly VERCEL_BRANCH_URL?: string;
  readonly VERCEL_PROJECT_PRODUCTION_URL?: string;
  readonly CONTACT_CLIENT_KEY_SECRET?: string;
  readonly CONTACT_ALLOWED_ORIGINS?: string;
  readonly CONTACT_RATE_LIMIT_MAX?: string;
  readonly CONTACT_RATE_LIMIT_WINDOW_MINUTES?: string;
  readonly DATABASE_URL?: string;
  readonly PREVIEW_DATABASE_URL?: string;
  readonly RESEND_API_KEY?: string;
  readonly CONTACT_EMAIL_FROM?: string;
  readonly CONTACT_EMAIL_TO?: string;
}

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function contactConfigFromEnv(env: ContactEnv = process.env): ContactConfig {
  const allowedOrigins = new Set<string>([site.url]);

  // A deployment is reachable by more than one hostname: its own URL, a stable
  // branch alias, and the production domain alias.
  for (const host of [
    env.VERCEL_URL,
    env.VERCEL_BRANCH_URL,
    env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    if (host) allowedOrigins.add(`https://${host}`);
  }

  for (const origin of env.CONTACT_ALLOWED_ORIGINS?.split(',') ?? []) {
    const trimmed = origin.trim();
    if (trimmed) allowedOrigins.add(trimmed);
  }

  if (env.NODE_ENV !== 'production') {
    for (const origin of LOCAL_DEV_ORIGINS) allowedOrigins.add(origin);
  }

  const clientKeySecret = env.CONTACT_CLIENT_KEY_SECRET;
  if (!clientKeySecret) {
    throw new Error('CONTACT_CLIENT_KEY_SECRET must be set');
  }

  return {
    allowedOrigins: [...allowedOrigins],
    clientKeySecret,
    rateLimit: {
      max: positiveInt(env.CONTACT_RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT_MAX),
      windowMs:
        positiveInt(env.CONTACT_RATE_LIMIT_WINDOW_MINUTES, DEFAULT_RATE_LIMIT_WINDOW_MINUTES) *
        60_000,
    },
    contactPagePath: CONTACT_PAGE_PATH,
  };
}

/**
 * Production and preview read different variables, and Vercel scopes each to
 * its own environment. A preview deployment therefore cannot reach the
 * production database even if its code is identical.
 */
export function databaseUrlFromEnv(env: ContactEnv = process.env): string {
  const isPreview = env.VERCEL_ENV === 'preview';
  const variable = isPreview ? 'PREVIEW_DATABASE_URL' : 'DATABASE_URL';
  const url = isPreview ? env.PREVIEW_DATABASE_URL : env.DATABASE_URL;

  if (!url) {
    throw new Error(`${variable} must be set`);
  }

  return url;
}
