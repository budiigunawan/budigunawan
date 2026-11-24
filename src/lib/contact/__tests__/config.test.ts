import { describe, expect, it } from 'vitest';

import { contactConfigFromEnv, databaseUrlFromEnv } from '../config';

describe('databaseUrlFromEnv', () => {
  it('reads only the preview database in a preview deployment', () => {
    expect(
      databaseUrlFromEnv({ VERCEL_ENV: 'preview', PREVIEW_DATABASE_URL: 'postgres://preview' }),
    ).toBe('postgres://preview');
  });

  it('refuses to fall back to the production database in a preview deployment', () => {
    expect(() =>
      databaseUrlFromEnv({ VERCEL_ENV: 'preview', DATABASE_URL: 'postgres://production' }),
    ).toThrow('PREVIEW_DATABASE_URL');
  });

  it('reads the production database in a production deployment', () => {
    expect(
      databaseUrlFromEnv({ VERCEL_ENV: 'production', DATABASE_URL: 'postgres://production' }),
    ).toBe('postgres://production');
  });
});

describe('contactConfigFromEnv', () => {
  it('always trusts the canonical origin, plus declared ones, and no dev origin in production', () => {
    const config = contactConfigFromEnv({
      NODE_ENV: 'production',
      CONTACT_CLIENT_KEY_SECRET: 'secret',
      CONTACT_ALLOWED_ORIGINS: 'https://budigunawan-git-branch.vercel.app',
    });

    expect(config.allowedOrigins).toContain('https://budigunawan.com');
    expect(config.allowedOrigins).toContain('https://budigunawan-git-branch.vercel.app');
    expect(config.allowedOrigins).not.toContain('http://localhost:4321');
  });

  it('trusts the deployment hostnames Vercel publishes', () => {
    const config = contactConfigFromEnv({
      CONTACT_CLIENT_KEY_SECRET: 'secret',
      VERCEL_URL: 'budigunawan-abc123.vercel.app',
      VERCEL_BRANCH_URL: 'budigunawan-git-branch.vercel.app',
      VERCEL_PROJECT_PRODUCTION_URL: 'budigunawan.vercel.app',
    });

    expect(config.allowedOrigins).toEqual(
      expect.arrayContaining([
        'https://budigunawan-abc123.vercel.app',
        'https://budigunawan-git-branch.vercel.app',
        'https://budigunawan.vercel.app',
      ]),
    );
  });

  it('trusts the local dev origin outside production', () => {
    const config = contactConfigFromEnv({ NODE_ENV: 'development', CONTACT_CLIENT_KEY_SECRET: 'secret' });

    expect(config.allowedOrigins).toContain('http://localhost:4321');
  });

  it('refuses to run without a client key secret', () => {
    expect(() => contactConfigFromEnv({ NODE_ENV: 'production' })).toThrow(
      'CONTACT_CLIENT_KEY_SECRET',
    );
  });

  it('defaults to five messages in a rolling hour', () => {
    const config = contactConfigFromEnv({ CONTACT_CLIENT_KEY_SECRET: 'secret' });

    expect(config.rateLimit).toEqual({ max: 5, windowMs: 3_600_000 });
  });
});
