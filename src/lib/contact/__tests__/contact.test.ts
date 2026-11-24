import { afterEach, describe, expect, it, vi } from 'vitest';

import { handleContact } from '../handler';
import {
  FakeContactStore,
  FakeNotifier,
  formRequest,
  jsonRequest,
  makeConfig,
  makeDeps,
} from './fakes';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'I would like to talk about a role on your team.',
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('POST /api/contact', () => {
  it('stores exactly one Contact Message and sends exactly one notification for a valid submission', async () => {
    const store = new FakeContactStore();
    const notifier = new FakeNotifier();

    const response = await handleContact(jsonRequest(valid), makeDeps({ store, notifier }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(store.messages).toHaveLength(1);
    expect(store.messages[0]).toMatchObject(valid);
    expect(notifier.sent).toHaveLength(1);
    expect(notifier.sent[0].id).toBe(store.messages[0].id);
  });

  it('rejects missing fields with a field-level body and stores nothing', async () => {
    const store = new FakeContactStore();

    const response = await handleContact(
      jsonRequest({ name: '   ', email: '', message: '' }),
      makeDeps({ store }),
    );

    expect(response.status).toBe(400);
    const body = (await response.json()) as { ok: boolean; errors: Record<string, string> };
    expect(body.ok).toBe(false);
    expect(Object.keys(body.errors).sort()).toEqual(['email', 'message', 'name']);
    expect(store.messages).toHaveLength(0);
  });

  it('rejects a malformed email and values outside the length bounds', async () => {
    const invalidCases = [
      { body: { ...valid, email: 'ada@example' }, field: 'email' },
      { body: { ...valid, name: 'x'.repeat(101) }, field: 'name' },
      { body: { ...valid, message: 'too short' }, field: 'message' },
      { body: { ...valid, message: 'x'.repeat(5001) }, field: 'message' },
    ];

    for (const testCase of invalidCases) {
      const store = new FakeContactStore();
      const response = await handleContact(jsonRequest(testCase.body), makeDeps({ store }));
      const body = (await response.json()) as { errors: Record<string, string> };

      expect(response.status, JSON.stringify(testCase.body)).toBe(400);
      expect(Object.keys(body.errors)).toEqual([testCase.field]);
      expect(body.errors[testCase.field]).toBeTruthy();
      expect(store.messages).toHaveLength(0);
    }
  });

  it('answers a filled honeypot exactly like a success, storing and sending nothing', async () => {
    const store = new FakeContactStore();
    const notifier = new FakeNotifier();

    const botResponse = await handleContact(
      jsonRequest({ name: '', email: '', message: '', website: 'https://spam.example' }),
      makeDeps({ store, notifier }),
    );
    const realResponse = await handleContact(jsonRequest(valid), makeDeps({}));

    expect(botResponse.status).toBe(200);
    expect(await botResponse.text()).toBe(await realResponse.text());
    expect(store.messages).toHaveLength(0);
    expect(notifier.sent).toHaveLength(0);
  });

  it('rejects submissions beyond the rolling per-client limit, storing nothing further', async () => {
    const store = new FakeContactStore();
    const notifier = new FakeNotifier();
    const config = makeConfig({ rateLimit: { max: 2, windowMs: 60 * 60 * 1000 } });
    const deps = makeDeps({ store, notifier, config });

    expect((await handleContact(jsonRequest(valid), deps)).status).toBe(200);
    expect((await handleContact(jsonRequest(valid), deps)).status).toBe(200);

    const limited = await handleContact(jsonRequest(valid), deps);

    expect(limited.status).toBe(429);
    expect(((await limited.json()) as { ok: boolean }).ok).toBe(false);
    expect(store.messages).toHaveLength(2);
    expect(notifier.sent).toHaveLength(2);

    const otherClient = await handleContact(
      jsonRequest(valid, { 'x-forwarded-for': '198.51.100.9' }),
      deps,
    );
    expect(otherClient.status).toBe(200);
  });

  it('lets the same client submit again once the rolling window has passed', async () => {
    const store = new FakeContactStore();
    let now = new Date('2026-11-24T03:00:00.000Z');
    const config = makeConfig({ rateLimit: { max: 1, windowMs: 60 * 60 * 1000 } });
    const deps = makeDeps({ store, config, now: () => now });

    expect((await handleContact(jsonRequest(valid), deps)).status).toBe(200);
    expect((await handleContact(jsonRequest(valid), deps)).status).toBe(429);

    now = new Date('2026-11-24T04:30:00.000Z');

    expect((await handleContact(jsonRequest(valid), deps)).status).toBe(200);
  });

  it('keeps the message, answers success, and logs only its id when the notifier fails', async () => {
    const store = new FakeContactStore();
    const notifier = new FakeNotifier();
    notifier.failWith = new Error('mail provider unavailable');
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await handleContact(jsonRequest(valid), makeDeps({ store, notifier }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(store.messages).toHaveLength(1);

    const logged = errorLog.mock.calls.flat().map(String).join('\n');
    expect(logged).toContain(store.messages[0].id);
    expect(logged).not.toContain(valid.message);
    expect(logged).not.toContain(valid.email);
    expect(logged).not.toContain(valid.name);
  });

  it('stores a keyed hash of the client address, never the address itself', async () => {
    const store = new FakeContactStore();
    const deps = makeDeps({ store });

    await handleContact(
      jsonRequest(valid, { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }),
      deps,
    );
    await handleContact(jsonRequest(valid), deps);

    const [first, second] = store.messages;
    expect(first.clientKey).toMatch(/^[0-9a-f]{64}$/);
    expect(first.clientKey).not.toContain('203.0.113.7');
    expect(second.clientKey).toBe(first.clientKey);
  });

  it('writes nothing from the request body to logs, even when the notifier fails', async () => {
    const logs = (['log', 'info', 'warn', 'error', 'debug'] as const).map((method) =>
      vi.spyOn(console, method).mockImplementation(() => {}),
    );
    const notifier = new FakeNotifier();
    notifier.failWith = new Error('mail provider unavailable');

    await handleContact(jsonRequest(valid), makeDeps({ notifier }));

    const logged = logs.flatMap((spy) => spy.mock.calls.flat()).map(String).join('\n');
    expect(logged).not.toContain(valid.name);
    expect(logged).not.toContain(valid.email);
    expect(logged).not.toContain(valid.message);
  });

  it('rejects a submission from another origin, storing nothing', async () => {
    const store = new FakeContactStore();

    const response = await handleContact(
      jsonRequest(valid, { origin: 'https://evil.example' }),
      makeDeps({ store }),
    );

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ ok: false });
    expect(store.messages).toHaveLength(0);
  });

  it('rejects a cross-origin referer when no origin is sent', async () => {
    const store = new FakeContactStore();
    const request = new Request('https://budigunawan.com/api/contact', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: '',
        referer: 'https://evil.example/contact',
        'x-forwarded-for': '203.0.113.7',
      },
      body: JSON.stringify(valid),
    });

    const response = await handleContact(request, makeDeps({ store }));

    expect(response.status).toBe(403);
    expect(store.messages).toHaveLength(0);
  });

  it('accepts an origin the deployment declares, such as its own preview URL', async () => {
    const store = new FakeContactStore();
    const config = makeConfig({
      allowedOrigins: ['https://budigunawan.com', 'https://budigunawan-git-branch.vercel.app'],
    });

    const response = await handleContact(
      jsonRequest(valid, { origin: 'https://budigunawan-git-branch.vercel.app' }),
      makeDeps({ store, config }),
    );

    expect(response.status).toBe(200);
    expect(store.messages).toHaveLength(1);
  });

  it('answers a form submission with a redirect to the Contact page instead of JSON', async () => {
    const store = new FakeContactStore();
    const notifier = new FakeNotifier();

    const response = await handleContact(formRequest(valid), makeDeps({ store, notifier }));

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/contact?sent=1');
    expect(await response.text()).toBe('');
    expect(store.messages).toHaveLength(1);
    expect(notifier.sent).toHaveLength(1);
  });

  it('sends a form validation failure back to the Contact page without storing anything', async () => {
    const store = new FakeContactStore();

    const response = await handleContact(
      formRequest({ name: '', email: 'nope', message: '' }),
      makeDeps({ store }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/contact?error=validation');
    expect(store.messages).toHaveLength(0);
  });

  it('treats a filled honeypot in a form post exactly like a success', async () => {
    const store = new FakeContactStore();

    const response = await handleContact(
      formRequest({ ...valid, website: 'spam' }),
      makeDeps({ store }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/contact?sent=1');
    expect(store.messages).toHaveLength(0);
  });

  it('sends a rate-limited form post back with an error indicator', async () => {
    const store = new FakeContactStore();
    const deps = makeDeps({ store, config: makeConfig({ rateLimit: { max: 0, windowMs: 1000 } }) });

    const response = await handleContact(formRequest(valid), deps);

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/contact?error=rate');
    expect(store.messages).toHaveLength(0);
  });

  it('rejects an unsupported request format without storing anything', async () => {
    const store = new FakeContactStore();
    const request = new Request('https://budigunawan.com/api/contact', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
        origin: 'https://budigunawan.com',
        'x-forwarded-for': '203.0.113.7',
      },
      body: 'hello',
    });

    const response = await handleContact(request, makeDeps({ store }));

    expect(response.status).toBe(415);
    expect(store.messages).toHaveLength(0);
  });

  it('rejects a method other than POST', async () => {
    const request = new Request('https://budigunawan.com/api/contact', { method: 'GET' });

    const response = await handleContact(request, makeDeps());

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('POST');
  });

  it('answers a generic error, leaking no detail, when storage fails', async () => {
    const store = new FakeContactStore();
    store.failWith = new Error(`connection refused for ${valid.email}`);
    const notifier = new FakeNotifier();
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await handleContact(jsonRequest(valid), makeDeps({ store, notifier }));

    expect(response.status).toBe(500);
    const bodyText = await response.text();
    expect(bodyText).not.toContain('connection refused');
    expect(bodyText).not.toContain(valid.email);
    expect(store.messages).toHaveLength(0);
    expect(notifier.sent).toHaveLength(0);

    const logged = errorLog.mock.calls.flat().map(String).join('\n');
    expect(logged).not.toContain(valid.email);
    expect(logged).not.toContain(valid.message);
  });

  it('rejects a body that cannot be parsed', async () => {
    const store = new FakeContactStore();
    const request = new Request('https://budigunawan.com/api/contact', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://budigunawan.com',
        'x-forwarded-for': '203.0.113.7',
      },
      body: '{not json',
    });

    const response = await handleContact(request, makeDeps({ store }));

    expect(response.status).toBe(400);
    expect(store.messages).toHaveLength(0);
  });
});
