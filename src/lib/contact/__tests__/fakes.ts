import type { ContactDeps } from '../handler';
import type { ContactMessageDraft, ContactNotifier, ContactStore, StoredContactMessage } from '../ports';

export class FakeContactStore implements ContactStore {
  readonly messages: StoredContactMessage[] = [];
  failWith: Error | undefined;
  private nextId = 1;

  async save(draft: ContactMessageDraft): Promise<StoredContactMessage> {
    if (this.failWith) throw this.failWith;
    const message: StoredContactMessage = {
      ...draft,
      id: `msg_${this.nextId++}`,
      createdAt: new Date('2026-11-24T03:00:00.000Z'),
    };
    this.messages.push(message);
    return message;
  }

  async countSince(clientKey: string, since: Date): Promise<number> {
    return this.messages.filter(
      (message) => message.clientKey === clientKey && message.createdAt >= since,
    ).length;
  }
}

export class FakeNotifier implements ContactNotifier {
  readonly sent: StoredContactMessage[] = [];
  failWith: Error | undefined;

  async notify(message: StoredContactMessage): Promise<void> {
    if (this.failWith) throw this.failWith;
    this.sent.push(message);
  }
}

const defaultConfig: ContactDeps['config'] = {
  allowedOrigins: ['https://budigunawan.com'],
  clientKeySecret: 'test-client-key-secret',
  rateLimit: { max: 5, windowMs: 60 * 60 * 1000 },
  contactPagePath: '/contact',
};

export function makeConfig(overrides: Partial<ContactDeps['config']> = {}): ContactDeps['config'] {
  return { ...defaultConfig, ...overrides };
}

export function makeDeps(overrides: Partial<ContactDeps> = {}): ContactDeps {
  return {
    store: new FakeContactStore(),
    notifier: new FakeNotifier(),
    config: makeConfig(),
    now: () => new Date('2026-11-24T03:00:00.000Z'),
    ...overrides,
  };
}

export function jsonRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request('https://budigunawan.com/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://budigunawan.com',
      'x-forwarded-for': '203.0.113.7',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

export function formRequest(body: Record<string, string>): Request {
  return new Request('https://budigunawan.com/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://budigunawan.com',
      'x-forwarded-for': '203.0.113.7',
    },
    body: new URLSearchParams(body).toString(),
  });
}
